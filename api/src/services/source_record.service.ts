import { SourceRecord } from '@prisma/client'

import prisma from '../db/db_client'
import { FormService } from './form.service'
import { ISourceData } from '../routes/schemas/source_record.types'

/**
 * @class SourceRecordService
 * @description Handles business logic and database operations for the `SourceRecord` model.
 * Provides methods for creating and retrieving source records, ensuring data integrity
 * and encapsulating database interactions.
 */
export class SourceRecordService {
  /**
   * Creates a new source record in the database.
   * @param formId - The ID of the form associated with the source record.
   * @param sourceData - An array of source data objects containing questions and answers.
   * @returns The newly created source record object, including its associated source data.
   * @throws If the form does not exist or an error occurs during creation.
   */
  static async createSourceRecord(
    formId: string,
    sourceData: ISourceData[]
  ): Promise<SourceRecord> {
    await FormService.getFormById(formId)

    const newSourceRecord = await prisma.sourceRecord.create({
      data: {
        formId,
        sourceData: {
          create: sourceData,
        },
      },
      include: {
        sourceData: true,
      },
    })

    return newSourceRecord
  }

  /**
   * Fetches a source record by its ID.
   * @param id - The unique identifier of the source record.
   * @returns The source record object, including its associated source data.
   * @throws If the source record is not found or an error occurs.
   */
  static async getSourceRecordById(id: string): Promise<SourceRecord> {
    const sourceRecord = await prisma.sourceRecord.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        sourceData: true,
      },
    })

    return sourceRecord
  }
}
