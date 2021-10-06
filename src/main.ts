import { NestFactory } from '@nestjs/core'
import { concat, concatMap, lastValueFrom } from 'rxjs'

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
            generatorService
                .generateValues(20, () => generatorService.createCervejaria())
                .pipe(concatMap((c) => testingService.createCervejaria(c))),
            generatorService
                .generateValues(50, () => generatorService.createCerveja())
                .pipe(concatMap((c) => testingService.createCerveja(c))),
            generatorService
                .generateValues(20, () => generatorService.createCozinha())
                .pipe(concatMap((c) => testingService.createCozinha(c))),
            generatorService
                .generateValues(30, (n) => n)
                .pipe(concatMap(() => testingService.adicionarCozinhaACerveja())),
        ),
    )

    await app.close()
}

void bootstrap()
