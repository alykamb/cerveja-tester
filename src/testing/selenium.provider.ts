import { Provider } from '@nestjs/common'
import { Builder, ThenableWebDriver } from 'selenium-webdriver'

export const SELENIUM = Symbol('selenium')

export const seleniumProvider: Provider<ThenableWebDriver> = {
    provide: SELENIUM,
    useFactory: () => new Builder().forBrowser('chrome').build(),
}
