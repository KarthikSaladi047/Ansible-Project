let items = [];
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "b45e96323fmshf5e4bc50d3b8a90p1e091djsnfb21cde4eb87",
    "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
  },
};

let images = Array.from(document.getElementsByClassName('img'));

const get = async (city) => {
  let response = await fetch(
    "https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=" + city,
    options
  );
  let result = await response.json();
  return result;
};

let update = async (city, x) => {
  let b = document.getElementById("current" + x);
  b.innerHTML = city;
  let details = Array.from(document.getElementsByClassName("details" + x));
  let a = await get(city);
  console.log(a.max_temp);
  details.forEach((e, i) => {
    e.innerHTML = Object.values(a)[i];
  });
};

(() => {
  update("hyderabad", 2);
  images[1].src = "./images/hyderabad.jfif";
  delhi.addEventListener("click", () => {
    images[0].src = "./images/delhi.jfif";
    update("delhi", 1);
  });
  mumbai.addEventListener("click", () => {
    images[0].src = "./images/mumbai.jfif";
    update("mumbai", 1);
  });
  kochi.addEventListener("click", () => {
    images[0].src = "./images/kochi.jfif";
    update("kochi", 1);
  });
  kolkata.addEventListener("click", () => {
    images[0].src = "./images/kolkata.jfif";
    update("kolkata", 1);
  });
  hyderabad.addEventListener("click", () => {
    images[0].src = "./images/hyderabad.jpg";
    update("hyderabad", 1);
  });
  form1.addEventListener("submit", () => {
    form1.preven;
    let a = searchInput.value.toLowerCase();
    if(a=='hyderabad' || a=="kolkata" || a=="kochi" || a=="mumbai" || a=="delhi"){
      images[0].src = `./images/${a}.jfif`;
      update(a, 1);
    }
    else{
      images[0].src = "./images/choose.jfif";
      update(a, 1);
    }
  });
})();

(async () => {
  let a1 = one.cells;
  let a2 = two.cells;
  let a3 = three.cells;
  let a4 = four.cells;
  1;
  let b1 = Array.from(a1);
  let b2 = Array.from(a2);
  let b3 = Array.from(a3);
  let b4 = Array.from(a4);

  let c1 = await get("hyderabad");
  let c2 = await get("kolkata");
  let c3 = await get("mumbai");
  let c4 = await get("kochi");

  b1[0].innerHTML = "hyderabad";
  b1[1].innerHTML = c1.max_temp;
  b1[2].innerHTML = c1.min_temp;

  b2[0].innerHTML = "kolkata";
  b2[1].innerHTML = c2.max_temp;
  b2[2].innerHTML = c2.min_temp;

  b3[0].innerHTML = "mumbai";
  b3[1].innerHTML = c3.max_temp;
  b3[2].innerHTML = c3.min_temp;

  b4[0].innerHTML = "kochi";
  b4[1].innerHTML = c4.max_temp;
  b4[2].innerHTML = c4.min_temp;
})();
