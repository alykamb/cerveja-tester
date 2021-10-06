import { Injectable } from '@nestjs/common'
import * as faker from 'faker'
import * as fakerDe from 'faker/locale/de'
import { fake } from 'faker/locale/zh_TW'

import { CervejariaDto } from '../dtos/cervejaria.dto'
import { CozinhaDto } from '../dtos/cozinha.dto'
import { FOODS } from './food.constants'

@Injectable()
export class GeneratorService {
    private types = ['Golden Ale', 'Stout', 'Dunkel', 'Ipa', 'Pale Ale', 'Lager', 'Weizen']

    private cepGenerator = this.getCep()
    public createCerveja(): string {
        return `${faker.name.title()} ${this.types[Math.floor(Math.random() * this.types.length)]}`
    }

    private *getCep(): Generator<string> {
        while (true) {
            let n = 0
            let n2 = 0
            while (n < 10000) {
                n = Math.floor(Math.random() * 100000)
            }
            while (n2 < 100) {
                n2 = Math.floor(Math.random() * 1000)
            }
            yield `${n}-${n2}`
        }
    }

    public createCervejaria(): CervejariaDto {
        return {
            nome: `${fakerDe.name.lastName()} ${fakerDe.name.jobTitle()}`,
            logradouro: faker.address.streetAddress(true),
            cep: this.cepGenerator.next().value,
            cidade: faker.address.city(),
            estado: faker.address.state(),
        }
    }

    public createCozinha(): CozinhaDto {
        return {
            nome: FOODS[Math.floor(Math.random() * FOODS.length)],
            descricao: faker.lorem.sentences(),
        }
    }
}
