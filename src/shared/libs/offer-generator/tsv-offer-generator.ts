import dayjs from 'dayjs';

import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';

import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { Generate } from './consts-offer-generator.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) { }

  public generate(): string {
    const id = getRandomItem<string>(this.mockData.ids);
    const title = getRandomItem<string>(this.mockData.titles);
    const city = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomItems<string>(this.mockData.images).join(';');
    const isPremium = getRandomItem<string>(this.mockData.isPremium);
    const isFavorite = getRandomItem<string>(this.mockData.isFavorite);
    const rating = getRandomItem(this.mockData.ratings);
    const type = getRandomItem(this.mockData.types);
    const price = generateRandomValue(Generate.MIN_PRICE, Generate.MAX_PRICE).toString();
    const bedrooms = getRandomItem(this.mockData.bedrooms);
    const maxAdults = getRandomItem(this.mockData.maxAdults);
    const goods = getRandomItems(this.mockData.goods).join(';');
    const host = getRandomItem(this.mockData.hosts);
    const commentsCount = getRandomItem(this.mockData.commentsCounts);
    const latitude = getRandomItem(this.mockData.latitudes);
    const longitude = getRandomItem(this.mockData.longitudes);

    const createdDate = dayjs()
      .subtract(generateRandomValue(Generate.FIRST_WEEK_DAY, Generate.LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      id, title, createdDate, city,
      previewImage, images, isPremium, isFavorite,
      rating, type, bedrooms, maxAdults, price, goods, host, commentsCount, latitude, longitude
    ].join('\t');
  }
}
