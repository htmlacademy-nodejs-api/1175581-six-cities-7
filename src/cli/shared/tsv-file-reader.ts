import { readFileSync } from 'node:fs';

import { FileReader } from '../commands/file-reader.interface.js';
import { Offer } from './types/offer.type.js';
import { Host } from './types/host.type.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) { }

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      id,
      title,
      date,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
      firstName,
      lastName,
      commentsCount,
      latitude,
      longitude
    ] = line.split('\t');

    return {
      id,
      title,
      date,
      city,
      previewImage,
      images: this.parseList(images),
      isPremium: this.parseFlag(isPremium),
      isFavorite: this.parseFlag(isFavorite),
      rating: this.parseToNumber(rating),
      type,
      bedrooms: this.parseToNumber(bedrooms),
      maxAdults: this.parseToNumber(maxAdults),
      price: this.parseToNumber(price),
      goods: this.parseList(goods),
      host: this.parseHost(firstName, lastName),
      commentsCount: this.parseToNumber(commentsCount),
      latitude: this.parseLocation(latitude),
      longitude: this.parseLocation(longitude)
    };
  }

  private parseList(listString: string): string[] {
    return listString.split(';');
  }

  private parseToNumber(priceString: string): number {
    return Number.parseInt(priceString, 10);
  }

  private parseFlag(flag: string): boolean {
    return JSON.parse(flag);
  }

  private parseLocation(priceString: string): number {
    return Number.parseFloat(priceString);
  }

  private parseHost(firstName: string, lastName: string): Host {
    return {firstName, lastName};
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
