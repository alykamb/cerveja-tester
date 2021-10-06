import { NestFactory } from '@nestjs/core'
import { concat, concatMap, generate, lastValueFrom, merge } from 'rxjs'

import { AppModule } from './app.module'
// import { AppService } from './app.service'
import { GeneratorService } from './generator/generator.service'
import { TestingService } from './testing/testing.service'

async function bootstrap(): Promise<void> {
    const app = await NestFactory.createApplicationContext(AppModule)
    await app.init()
    // const appService = app.get(AppService)

    const generatorService = app.get(GeneratorService)
    const testingService = app.get(TestingService)
    console.clear()

    // await testingService.createCervejaria(generatorService.createCervejaria())

    await lastValueFrom(
        concat(
            generate(
                0,
                (x) => x < 20,
                (x) => x + 1,
                () => generatorService.createCervejaria(),
            ).pipe(concatMap((c) => testingService.createCervejaria(c))),
            generate(
                0,
                (x) => x < 50,
                (x) => x + 1,
                () => generatorService.createCerveja(),
            ).pipe(concatMap((c) => testingService.createCerveja(c))),
            generate(
                0,
                (x) => x < 20,
                (x) => x + 1,
                () => generatorService.createCozinha(),
            ).pipe(concatMap((c) => testingService.createCozinha(c))),

            generate(
                0,
                (x) => x < 30,
                (x) => x + 1,
            ).pipe(concatMap(() => testingService.adicionarCozinhaACerveja())),
        ),
    )

    await app.close()
}

void bootstrap()
