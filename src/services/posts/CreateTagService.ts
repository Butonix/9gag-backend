import { getRepository } from 'typeorm';
import slugify from 'slugify';
import ServiceError from '../../util/ServiceError';
import File from '../../models/File';
import Tag from '../../models/Tag';

interface Request {
  icon: string;
  name: string;
}

class CreateTagService {
  public async execute({ icon, name }: Request): Promise<Tag> {
    const filesRepository = getRepository(File);
    const tagsRepository = getRepository(Tag);

    const fileExits = await filesRepository.findOne({
      where: { id: icon },
    });

    // if (!fileExits) {
    //   throw new ServiceError('Invalid Icon Id.', 400);
    // }

    const createdAt = new Date();
    const updatedAt = new Date();

    try {
      const tagData = tagsRepository.create({
        icon: fileExits,
        name,
        slug: slugify(name),
        createdAt,
        updatedAt,
      });
      const tag = await tagsRepository.save(tagData);
      if (tag) {
        return await tagsRepository.findOne({
          where: { id: tag.id },
          relations: ['icon'],
        });
      }
      throw new ServiceError(`error on retrive new tag from database.`);
    } catch (err) {
      throw new ServiceError(`error on create tag: ${err}`);
    }
  }
}

export default CreateTagService;
