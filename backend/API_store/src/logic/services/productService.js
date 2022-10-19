const productRepository = require('../../data/repositories/productRepository');
const productSpecRepository = require('../../data/repositories/productSpecRepository');
const brandRepository = require('../../data/repositories/brandRepository');
const colorRepository = require('../../data/repositories/colorRepository');
const typeRepository = require('../../data/repositories/typeRepository');

const ApplicationError = require('../errors/ApplicationError');
const ValidationError = require('../errors/ValidationError');
const Product = require('../../models/Product');
const ProductSpec = require('../../models/ProductSpec');

const productValidator = require('../validators/productValidator');
const axios = require('axios');
const config = require('../../config');
const FormData = require('form-data');

class ProductService {
  async create(name, price, image, brandId, typeId, colorsIds, productSpecs) {
    productSpecs = JSON.parse(productSpecs);
    colorsIds = JSON.parse(colorsIds);

    const obj = new Product(0, name, price, 0, image, brandId, typeId, colorsIds);
    const validationResult = productValidator.validate(obj);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult.faults);
    }

    if(!(await brandRepository.getById(brandId))) {
      throw new ApplicationError('brand does not exist');
    }

    if(!(await typeRepository.getById(typeId))) {
      throw new ApplicationError('type does not exist');
    }

    for(const colorId of colorsIds) {
      if(!(await colorRepository.getById(colorId))) {
        throw new ApplicationError('color does not exist');
      }
    }

    if (!image) {
      obj.image = 'NONE';
    } else {
      const formData = new FormData();
      formData.append('img', image.data);
      const result = await axios.post(config.cdnUrl + '/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      obj.image = result.data;
    }

    const resultId = (await productRepository.create(obj)).insertId;
    for (const spec of productSpecs) {
      await productSpecRepository.create(new ProductSpec(0, spec.title, spec.description, resultId));
    }

    return resultId;
  }

  async addProducts(id, quantity) {
    const product = await productRepository.getById(id);

    if(!product) {
      throw new ApplicationError('product does not exist');
    }

    product.quantity += quantity;
    return await productRepository.update(product);
  }

  async getAll(limit = 2, page = 1, brandId = null, typeId = null, orderBy = 'name', order = 'desc') {
    limit = +limit;
    page = +page;
    const offset = limit * page - limit;
    let result;
    if (brandId && typeId) {
      result = await productRepository.getAllByOffsetWithLimitAndFiltration(offset, limit, `where brandId = ${brandId} and typeId = ${typeId}`, orderBy, order);
    } else if (brandId && !typeId) {
      result = await productRepository.getAllByOffsetWithLimitAndFiltration(offset, limit, `where brandId = ${brandId}`, orderBy, order);
    } else if (!brandId && typeId) {
      result = await productRepository.getAllByOffsetWithLimitAndFiltration(offset, limit, `where typeId = ${typeId}`, orderBy, order);
    } else {
      result = await productRepository.getAllByOffsetWithLimit(offset, limit, orderBy, order);
    }

    return result;
  }

  async getById(productId) {
    const result = await productRepository.getById(productId);

    if (!result) {
      throw new ApplicationError('object was not found');
    }

    return result;
  }
}

module.exports = new ProductService();