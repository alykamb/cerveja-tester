import { Inject, Injectable } from '@nestjs/common'
import * as chalk from 'chalk'
import { By, ThenableWebDriver, until } from 'selenium-webdriver'

import { CervejariaDto } from '../dtos/cervejaria.dto'
import { CozinhaDto } from '../dtos/cozinha.dto'
import { SELENIUM } from './selenium.provider'

@Injectable()
export class TestingService {
    constructor(@Inject(SELENIUM) private driver: ThenableWebDriver) {}
    // public listCervejarias(): Promise<boolean> {}
    // public async findCervejaria(cervejaria: CervejariaDto): Promise<boolean> {}
    public async createCervejaria(cervejaria: CervejariaDto): Promise<CervejariaDto> {
        const d = this.driver

        await d.get('http://localhost:8080/cervejarias/novo')
        await Promise.all(
            Object.keys(cervejaria).map((key) =>
                d.findElement(By.name(key)).sendKeys(cervejaria[key]),
            ),
        )
        await d.findElement(By.name('cadastrar')).click()
        await d.wait(
            until.elementTextIs(
                await d.findElement(By.className('success')),
                `Cervejaria ${cervejaria.nome} adicionada com sucesso`,
            ),
            200,
        )
        console.log(chalk.blueBright('Cervejaria %s cadastrada'), cervejaria.nome)
        return cervejaria
    }

    public async createCerveja(cerveja: string): Promise<string> {
        const d = this.driver

        await d.get('http://localhost:8080/cervejas/novo')

        const optionsValues = d
            .findElements(By.css('select[name="cervejaria_id"] option'))
            .then((optionsEls) => Promise.all(optionsEls.map((el) => el.getAttribute('value'))))
            .then((values) => values.filter((el) => el).map((v) => parseInt(v, 10)))

        await Promise.all([
            d.findElement(By.name('nome')).sendKeys(cerveja),
            optionsValues.then((values) =>
                d.executeScript(
                    `document.getElementById('cervejaria_id').value = ${
                        values[Math.floor(Math.random() * values.length)]
                    }`,
                ),
            ),
        ])

        await d.findElement(By.name('cadastrar')).click()
        await d.wait(
            until.elementTextIs(
                await d.findElement(By.className('success')),
                `Cerveja ${cerveja} adicionada com sucesso`,
            ),
            200,
        )
        console.log(chalk.greenBright('Cerveja %s cadastrada'), cerveja)
        return cerveja
    }

    public async createCozinha(cozinha: CozinhaDto): Promise<CozinhaDto> {
        const d = this.driver

        await d.get('http://localhost:8080/cozinhas/novo')
        await Promise.all(
            Object.keys(cozinha).map((key) => d.findElement(By.id(key)).sendKeys(cozinha[key])),
        )
        await d.findElement(By.name('cadastrar')).click()
        await d.wait(
            until.elementTextIs(
                await d.findElement(By.className('success')),
                `Cozinha ${cozinha.nome} adicionada com sucesso`,
            ),
            200,
        )
        console.log(chalk.yellowBright('Cozinha %s cadastrada'), cozinha.nome)
        return cozinha
    }

    public async adicionarCozinhaACerveja(): Promise<void> {
        const d = this.driver

        const cervejas = await d
            .get('http://localhost:8080/cervejas')
            .then(() => d.findElements(By.css('tr td:first-child')))
            .then((els) => Promise.all(els.map((el) => el.getText())))
            .then((values) => values.filter((el) => el).map((v) => parseInt(v, 10)))

        const cerveja = cervejas[Math.floor(Math.random() * cervejas.length)]
        await d.get(`http://localhost:8080/cervejas/${cerveja}/editar-cozinhas`)

        const cozinhas = await d
            .findElements(By.css('.cozinhas input[type="checkbox"]'))
            .then((els) =>
                Promise.all(
                    els.map((el) =>
                        Promise.all([el.getAttribute('value'), el.getAttribute('checked')]),
                    ),
                ),
            )
            .then((values) => values.filter((el) => el[0] && !el[1]).map((v) => parseInt(v[0], 10)))

        if (cozinhas.length) {
            const cozinhasSalvar = new Set([
                cozinhas[Math.floor(Math.random() * cozinhas.length)],
                ...cozinhas.filter(() => Math.round(Math.random())),
            ])
            await Promise.all(
                cozinhas.map((cozinha) =>
                    d
                        .findElement(By.css(`.cozinhas input[type="checkbox"][value="${cozinha}"]`))
                        .click(),
                ),
            )
            await d.findElement(By.name('atualizar-cozinhas')).click()

            console.log(
                chalk.magentaBright(
                    `Cozinhas ${Array.from(cozinhasSalvar).join(
                        ', ',
                    )} adicionadas a cerveja ${cerveja}`,
                ),
            )
        }
    }
}
