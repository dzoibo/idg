import { apiClient } from '@/plugins/axios/api'
import type { MediaObject } from '@/models/interfaces/MediaObject'

export default class FileUploader {
  public static async uploadFile(file: File): Promise<MediaObject> {
    const form = new FormData()
    form.append('file', file)
    const data = (
      await apiClient.post(`/api/media_objects`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          accept: 'application/ld+json'
        }
      })
    ).data
    return data
  }
}
