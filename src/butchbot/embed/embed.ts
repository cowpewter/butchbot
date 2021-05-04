import {
  EmbedAuthor,
  EmbedField,
  EmbedFooter,
  EmbedImage,
  Embed as ErisEmbed,
  EmbedProvider,
  EmbedVideo,
} from "eris";
import { stringToColor } from "../utils/color";

import { DEFAULT_EMBED_FOOTER } from "../defaults";

enum EmbedType {
  RICH = "rich",
  IMAGE = "image",
  VIDEO = "video",
  GIFV = "gifv",
  ARTICLE = "article",
  LINK = "link",
}

export class Embed {
  private author?: EmbedAuthor;
  private color?: number;
  private description?: string;
  private fields?: EmbedField[];
  private footer?: EmbedFooter = DEFAULT_EMBED_FOOTER;
  private image?: EmbedImage;
  private provider?: EmbedProvider;
  private thumbnail?: EmbedImage;
  private timestamp?: Date | string;
  private title?: string;
  private type: EmbedType = EmbedType.RICH;
  private url?: string;
  private video?: EmbedVideo;

  public setAuthor = (value: EmbedAuthor) => (this.author = value);

  public setColor = (value: string | number) =>
    (this.color = stringToColor(value));

  public setDescription = (value: string) => (this.description = value);

  public addField = (value: EmbedField) => {
    if (!this.fields) {
      this.fields = [];
    }
    this.fields.push(value);
  };

  public setFooter = (value: EmbedFooter) => (this.footer = value);

  public setImage = (value: EmbedImage) => (this.image = value);

  public setProvider = (value: EmbedProvider) => (this.provider = value);

  public setThumbnail = (value: EmbedImage) => (this.thumbnail = value);

  public setTimestamp = (value: Date | string) => (this.timestamp = value);

  public setTitle = (value: string) => (this.title = value);

  public setType = (value: EmbedType) => (this.type = value);

  public setUrl = (value: string) => (this.url = value);

  public setVideo = (value: EmbedVideo) => (this.video = value);

  public getEris = (): ErisEmbed => ({
    author: this.author,
    color: this.color,
    description: this.description,
    fields: this.fields,
    footer: this.footer,
    image: this.image,
    provider: this.provider,
    thumbnail: this.thumbnail,
    timestamp: this.timestamp,
    title: this.title,
    type: this.type,
    url: this.url,
    video: this.video,
  });
}
