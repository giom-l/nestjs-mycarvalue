import { Injectable, NotFoundException } from '@nestjs/common';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    console.log(`[ReportService] Creating report...`);
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    console.log(
      `[ReportService] Changing approval of report ${id} to ${approved}...`,
    );
    const report_id = parseInt(id);
    const report = await this.repo.findOneBy({ id: report_id });
    if (!report) {
      throw new NotFoundException(`Report with id ${report_id} not found`);
    }
    report.approved = approved;
    return this.repo.save(report);
  }

  getAllReports({ make, model, year, mileage, lat, lng }: GetEstimateDto) {
    return (
      this.repo
        .createQueryBuilder()
        .select('*')
        .where('make = :make and model = :model', {
          make: make,
          model: model,
        })
        // working but naive
        // .andWhere('lng-3 <= :lng and lng+3 >= :lng', { lng: lng })
        // .andWhere('lat-3 <= :lat and lat+3 >= :lat', { lat: lat })
        // .andWhere('year-3 <= :year and year+3 >= :year', { year: year })
        .andWhere('lat - :lat BETWEEN -3 AND 3', { lat: lat })
        .andWhere('lng - :lng BETWEEN -3 AND 3', { lng: lng })
        .andWhere('year - :year BETWEEN -3 AND 3', { year: year })
        .andWhere('approved IS TRUE')
        .orderBy('ABS(mileage -:mileage)', 'ASC')
        .setParameters({ mileage: mileage })
        .getRawMany()
    );
  }
  async createEstimate({
    make,
    model,
    year,
    mileage,
    lat,
    lng,
  }: GetEstimateDto) {
    console.log(
      `[ReportService] Generating estimate from {make: ${make}, model: ${model}, year: ${year}, mileage: ${mileage}, lat: ${lat}, lng: ${lng}}...`,
    );
    const response = (await this.repo
      .createQueryBuilder()
      .select('AVG(price) AS estimation')
      .where('make = :make and model = :model', {
        make: make,
        model: model,
      })
      // working but naive
      // .andWhere('lng-3 <= :lng and lng+3 >= :lng', { lng: lng })
      // .andWhere('lat-3 <= :lat and lat+3 >= :lat', { lat: lat })
      // .andWhere('year-3 <= :year and year+3 >= :year', { year: year })
      .andWhere('lat - :lat BETWEEN -3 AND 3', { lat: lat })
      .andWhere('lng - :lng BETWEEN -3 AND 3', { lng: lng })
      .andWhere('year - :year BETWEEN -3 AND 3', { year: year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage -:mileage)', 'ASC')
      .setParameters({ mileage: mileage })
      .limit(3)
      .getRawOne()) as { estimation: number };
    if (response.estimation === null) return null;
    return {
      make,
      model,
      year,
      mileage,
      lat,
      lng,
      estimation: Number(response.estimation.toFixed(2)),
    };
  }
}
