import { Module } from '@nestjs/common'

import { seleniumProvider } from './selenium.provider'
import { TestingService } from './testing.service'

const providers = [seleniumProvider, TestingService]

@Module({ providers, exports: providers })
export class TestingModule {}
