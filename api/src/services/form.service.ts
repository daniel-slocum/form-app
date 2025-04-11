import { Form } from '@prisma/client'

import prisma from '../db/db_client'
import { IFormFields } from '../routes/schemas/form.types'

/**
 * @class FormService
 * @description Handles business logic and database operations for the `Form` model.
 * Provides methods for creating and retrieving forms, ensuring data integrity
 * and encapsulating database interactions.
 */
export class FormService {
  /**
   * Creates a new form in the database.
   * @param name - The name of the form.
   * @param fields - The fields of the form, represented as a JSON object.
   * @returns The newly created form object.
   * @throws  If an error occurs while creating the form.
   */
  static async createForm(name: string, fields: IFormFields): Promise<Form> {
    const newForm = await prisma.form.create({
      data: {
        name,
        fields,
      },
    })

    return newForm
  }

  /**
   * Fetches a form by its ID.
   * @param id - The unique identifier of the form.
   * @returns The form object corresponding to the provided ID.
   * @throws If the form is not found or an error occurs.
   */
  static async getFormById(id: string): Promise<Form> {
    const form = await prisma.form.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return form
  }
}
