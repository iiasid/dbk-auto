// script.js

function filterCars() {
  const brand = document.getElementById('brand').value.toLowerCase();
  const model = document.getElementById('model').value.toLowerCase();
  const price = parseInt(document.getElementById('price').value);

  const cars = document.querySelectorAll('.car');

  cars.forEach(car => {
    const carBrand = car.dataset.brand.toLowerCase();
    const carModel = car.dataset.model.toLowerCase();
    const carPrice = parseInt(car.dataset.price);

    if (
      (brand === 'all' || carBrand === brand) &&
      (model === '' || carModel.includes(model)) &&
      (isNaN(price) || carPrice <= price)
    ) {
      car.style.display = 'block';
    } else {
      car.style.display = 'none';
    }
  });
}
