import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { TopicLevel, ResourceType } from '@prisma/client';

export class CreateTrackDto {
  @ApiProperty({ example: 'frontend' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Frontend Engineering' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Master HTML, CSS, JavaScript, React, and modern web development.' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateRoadmapDto {
  @ApiProperty({ description: 'ID of the track this roadmap belongs to' })
  @IsString()
  @IsNotEmpty()
  trackId: string;

  @ApiProperty({ example: 'Backend Career Path 2026' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Complete roadmap for backend engineers' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '1.0.0' })
  @IsString()
  @IsNotEmpty()
  version: string;
}

export class CreateMilestoneDto {
  @ApiProperty({ description: 'ID of the roadmap' })
  @IsString()
  @IsNotEmpty()
  roadmapId: string;

  @ApiProperty({ example: 'Backend Fundamentals' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Core concepts every backend developer must master' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0)
  order: number;
}

export class CreateTopicDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roadmapId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  milestoneId?: string;

  @ApiProperty({ example: 'Relational Databases (PostgreSQL)' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Learn ACID properties, schema design, normalization, indexing, and SQL queries.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: TopicLevel, example: TopicLevel.INTERMEDIATE })
  @IsEnum(TopicLevel)
  level: TopicLevel;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0)
  order: number;

  @ApiPropertyOptional({ example: 8.0 })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  estimatedHours?: number;
}

export class UpdateTopicDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TopicLevel })
  @IsOptional()
  @IsEnum(TopicLevel)
  level?: TopicLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  estimatedHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  milestoneId?: string;
}

export class CreateResourceDto {
  @ApiProperty({ description: 'Topic ID to attach this resource to' })
  @IsString()
  @IsNotEmpty()
  topicId: string;

  @ApiProperty({ enum: ResourceType, example: ResourceType.DOCS })
  @IsEnum(ResourceType)
  type: ResourceType;

  @ApiProperty({ example: 'https://www.postgresql.org/docs/' })
  @IsUrl()
  url: string;

  @ApiProperty({ example: 'PostgreSQL Official Documentation' })
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class AddPrerequisiteDto {
  @ApiProperty({ description: 'The topic that requires the prerequisite' })
  @IsString()
  @IsNotEmpty()
  topicId: string;

  @ApiProperty({ description: 'The prerequisite topic that must be completed first' })
  @IsString()
  @IsNotEmpty()
  prerequisiteId: string;
}
