import { createReadStream } from 'node:fs';
import { FileReader } from '../cli/commands/file-reader.interface.js';
import { Offer } from './types/offer.type.js';

import EventEmitter from 'node:events';

const RADIX = 10;

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384; // 16KB

  constructor(
    private readonly filename: string
  ) {
    super();
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
      host,
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
      host,
      commentsCount: this.parseToNumber(commentsCount),
      latitude: this.parseLocation(latitude),
      longitude: this.parseLocation(longitude)
    };
  }

  private parseList(listString: string): string[] {
    return listString.split(';');
  }

  private parseToNumber(priceString: string): number {
    return Number.parseInt(priceString, RADIX);
  }

  private parseFlag(flag: string): boolean {
    return JSON.parse(flag);
  }

  private parseLocation(priceString: string): number {
    return Number.parseFloat(priceString);
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        this.emit('line', parsedOffer);
      }
    }

    this.emit('end', importedRowCount);
  }

}
