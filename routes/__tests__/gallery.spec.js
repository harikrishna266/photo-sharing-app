const request = require('supertest');
const express = require('express');
const multer = require('multer');
const Gallery = require('../../models/Gallery');
const galleryRoutes = require('../gallery');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/', galleryRoutes);

describe('Gallery Routes', () => {
  test('should upload an image', async () => {

    const path = require('path');
    const imagePath = path.join(__dirname, '../../public/images/image-1691489047105.jpg');

    // Mock Gallery.create to avoid actual database operations
    Gallery.create = jest.fn((data, callback) => {
      callback(null, data); // Mock successful creation
    });

    // Perform the request
    const response = await request(app)
      .post('/')
      .field('imageTitle', 'Test Image')
      .field('imageDesc', 'Test Description')
      .attach('file', imagePath); // Update the path to a valid image file

    expect(response.status).toBe(200);
    expect(Gallery.create).toHaveBeenCalled();
  });

  test('should retrieve all images', async () => {
    // Mock Gallery.find to return mock data
    const mockImages = [{ imageTitle: 'Image 1' }, { imageTitle: 'Image 2' }];
    Gallery.find = jest.fn().mockResolvedValue(mockImages);

    // Perform the request
    const response = await request(app).get('/all');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockImages);
  });

  test('should delete an image', async () => {
    const mockImageId = 'mock-image-id';
    // Mock Gallery.findByIdAndDelete to simulate successful deletion
    Gallery.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: mockImageId });

    // Perform the request
    const response = await request(app).delete(`/${mockImageId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Image deleted successfully');
    expect(response.body.deletedImage._id).toBe(mockImageId);
  });
});