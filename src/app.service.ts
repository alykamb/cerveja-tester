import { Inject, Injectable } from '@nestjs/common'
import { By, Key, ThenableWebDriver, until } from 'selenium-webdriver'

import { SELENIUM } from './testing/selenium.provider'

@Injectable()
export class AppService {
    constructor(@Inject(SELENIUM) private driver: ThenableWebDriver) {}

    public async testDriver(): Promise<void> {
        try {
            await this.driver.get('http://www.google.com/ncr')
            await this.driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN)
            await this.driver.wait(until.titleIs('webdriver - Pesquisa Google'), 1000)
        } finally {
            await this.driver.quit()
        }
    }
}
