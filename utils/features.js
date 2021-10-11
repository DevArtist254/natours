class APIFeatured {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1. The Query
    //Querying for specific items ie url :- /tour?duration=23&difficulty=easy
    //this returns strictly equal but their equal or greater than or less than move to 1B
    //Obj request query = {duration:23,difficulty:easy}
    let queryObj = { ...this.queryString };
    let removables = ['page', 'sort', 'limit', 'fields'];
    removables.forEach((el) => delete queryObj[el]);

    //1B - Matching
    //url :- /tour?duration[gte]=5 => {duration: {gte : 5}}  target  {duration: {$gte : 5}}
    //Convert to string
    let queryString = JSON.stringify(queryObj);
    //replace the matched str to add enable query
    queryString = queryString.replace(
      /\b{gte|gt|lte|lt}\b/g,
      (match) => `$${match}`
    );
    this.query.find(JSON.parse(queryString));

    return this;
  }

  sorted() {
    //sorting
    if (this.queryString.sort) {
      //Convert from "x","y","z" to "x y z"
      const sortedList = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortedList);
    }

    return this;
  }

  fields() {
    if (this.queryString.fields) {
      //Convert from "x","y","z" to "x y z"
      const selectedList = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(selectedList);
    }

    return this;
  }

  pagination() {
    let page, limit, skip;

    //convert to a number
    page = this.queryString.page * 1 || 1;
    limit = this.queryString.limit * 1 || 100;

    //formula to find the items that const a page
    skip = (page - 1) * limit;

    this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatured;
