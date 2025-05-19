import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
  ) {}

  async findAll(): Promise<Application[]> {
    this.logger.log('Getting all applications');
    return this.applicationsRepository.find();
  }

  async findOne(idOrName: string | number): Promise<Application> {
    const isNumeric = typeof idOrName === 'number' || !isNaN(Number(idOrName));
    
    const application = await this.applicationsRepository.findOne({
      where: isNumeric ? { id: Number(idOrName) } : { name: idOrName }
    });

    if (!application) {
      throw new NotFoundException(`Application not found`);
    }

    return application;
  }

  async create(applicationData: Partial<Application>): Promise<Application> {
    this.logger.log(`Creating application with name: ${applicationData.name}`);
    
    if (!applicationData.name) {
      throw new BadRequestException('Application name is required');
    }
    
    const application = this.applicationsRepository.create(applicationData);
    return this.applicationsRepository.save(application);
  }

  async update(id: number, applicationData: Partial<Application>): Promise<Application> {
    this.logger.log(`Updating application with ID: ${id}`);
    
    await this.findOne(id); // Verify application exists
    
    await this.applicationsRepository.update(id, applicationData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing application with ID: ${id}`);
    
    const application = await this.findOne(id);
    await this.applicationsRepository.remove(application);
  }
} 