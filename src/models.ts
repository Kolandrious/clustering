import mongoose, { Document } from 'mongoose';

export interface IPoint extends Document {
  type: 'Point',
  coordinates: number[];
  _id: 'string',
}

const pointsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [ 'Point' ],
    required: true,
  },
  coordinates: {
    type: [ Number ],
    required: true,
  }
});
pointsSchema.index({ coordinates: '2dsphere' });

export const Points = mongoose.model<IPoint>(
  'Points',
  pointsSchema,
);
