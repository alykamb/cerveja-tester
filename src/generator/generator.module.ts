import { Module } from '@nestjs/common'

import { GeneratorService } from './generator.service'

const providers = [GeneratorService]

@Module({ providers, exports: providers })
export class GeneratorModule {}
