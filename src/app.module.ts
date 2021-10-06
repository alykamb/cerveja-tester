import { Inject, Module, OnApplicationShutdown } from '@nestjs/common'
import { ThenableWebDriver } from 'selenium-webdriver'

import { AppService } from './app.service'
import { GeneratorModule } from './generator/generator.module'
import { SELENIUM } from './testing/selenium.provider'
import { TestingModule } from './testing/testing.module'

@Module({
    imports: [GeneratorModule, TestingModule],
    providers: [AppService],
})
export class AppModule implements OnApplicationShutdown {
    constructor(@Inject(SELENIUM) private driver: ThenableWebDriver) {}

    public async onApplicationShutdown(): Promise<void> {
        await this.driver.close()
    }
}
