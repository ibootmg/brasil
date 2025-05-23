import { Op, literal, fn, col } from "sequelize";
import Tag from "../../models/Tag";
//import ContactTag from "../../models/ContactTag";
import TicketTag from "../../models/TicketTag";
interface Request {
  companyId: number;
  searchParam?: string;
  pageNumber?: string | number;
  kanban?: number;
}

interface Response {
  tags: Tag[];
  count: number;
  hasMore: boolean;
}

const ListService = async ({
  companyId,
  searchParam,
  pageNumber = "1",
  kanban = 0
}: Request): Promise<Response> => {
  let whereCondition = {};
  //
  //  if ( Number(kanban) === 0 ) {
  //      if (searchParam) {
  //        whereCondition = {
  //         [Op.or]: [
  //           { name: { [Op.like]: `%${searchParam}%` } },
  //            { color: { [Op.like]: `%${searchParam}%` } }
  //            // { kanban: { [Op.like]: `%${searchParam}%` } }
  //          ]
  //        };
  //      }
  //      const limit = 20;
  //      const offset = limit * (+pageNumber - 1);

  //     const { count, rows: tags } = await Tag.findAndCountAll({
  //      where: { ...whereCondition, companyId, kanban },
  //      limit,
  //      offset,
  //      order: [["name", "ASC"]],
  //      subQuery: false,
  //      include: [
  //        { model: ContactTag,
  //          as: "contacttag",
  //          attributes: [], 
  //          required: false
  //        },     
  //      ],
  //      attributes: [
  //        'id',
  //        'name',
  //        'color',
  //        [fn('count', col('contacttag.tagId')), 'contactsCount']
  //      ],    
  //      group: 
  //        [ "Tag.id" ]
  //    });

  //    const hasMore = count > offset + tags.length;

  //    return {
  //      tags,
  //      count,
  //      hasMore
  //    };

  //  } else {
  //

  if (searchParam) {
    whereCondition = {
      [Op.or]: [
        { name: { [Op.like]: `%${searchParam}%` } },
        { color: { [Op.like]: `%${searchParam}%` } }
        // { kanban: { [Op.like]: `%${searchParam}%` } }
      ]
    };
  }
  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  const { count, rows: tags } = await Tag.findAndCountAll({
    where: { ...whereCondition, companyId, kanban },
    limit,
    offset,
    order: [["name", "ASC"]],
    subQuery: false,
    include: [
      {
        model: TicketTag,
        as: "ticketTags",
        attributes: [],
        required: false

      },
    ],
    attributes: [
      'id',
      'name',
      'color',
      [fn('count', col('ticketTags.tagId')), 'ticketsCount']
    ],
    group:
      ["Tag.id"]
  });

  const hasMore = count > offset + tags.length;

  return {
    tags,
    count,
    hasMore
    //    };
  }
};

export default ListService;
