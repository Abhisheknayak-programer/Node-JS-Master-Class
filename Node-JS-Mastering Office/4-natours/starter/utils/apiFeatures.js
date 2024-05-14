// Creating a class to store many functionalities and use them inside routes
class APIFeature {
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced Filtering [To filter out more advanced filterings]
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr)); // Build the query
    return this; // To Allow chaning functionalities
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" "); // If there is a tie while sorting with first argument, using second criteria to sort
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // When no sorting is mentioned then sort it according to created at object
    }
    return this; // To Allow chaning functionalities
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // Means we are excluding the __v field
    }
    return this; // To Allow chaning functionalities
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this; // To Allow chaning functionalities
  }
}

module.exports = APIFeature;
