

const breedsContainer = document.getElementById("breedsContainer");
const getBreedImg = async (breed) => {
  const dogApiURL = `https://dog.ceo/api/breed/${breed}/images/random`;
  try {
    let response = await fetch(dogApiURL);
    let data = await response.json();
    console.log(data);
    if (data && data.status == "success") {
        let breedName = document.getElementById('breedName');
        breedName.textContent = breed;
        let breedImg = document.getElementById('breedImg');
        breedImg.src = data.message;
        breedImg.removeAttribute('hidden');
    
    } else if (data.status == "error" || data.code == "404") {
      console.log("Breed not found");
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Breed not found!'
      })
    }
  } catch (err){
    console.log(err);
  }
};


const sendBreed = async () => {
    let payload = {
        breed: 'golden'
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(payload)
    }
    const response = await fetch('/breed',options);
    const data = await response.json();
    console.log(data);
}


const searchBreed = document.getElementById('searchBreed');
searchBreed.addEventListener('click', () => {
    console.log('Search breed..');
    let inputBreedValue = document.getElementById('inputBreed').value;
    console.log('inputBreedValue ', inputBreedValue);

    if(inputBreedValue) { 
        // const printBreedData = async () => {
        //     const qq = await getBreedImg(inputBreedValue)
        //     console.log(qq);
            
        //     if(qq.status == 'success'){
        //         let breedImage = document.createElement('img');
        //         breedImage.src = qq.message;
                
        //         breedResults.append(breedImage);
        //     }
        //     printBreedData();
        getBreedImg(inputBreedValue.toLowerCase());
    } else {
        console.log('Complete breed');
    }
});

const next = document.getElementById('next');
next.addEventListener('click',() => {
    const breedName = document.getElementById('breedName').textContent;
    let inputBreedValue = document.getElementById('inputBreed').value;
    getBreedImg(inputBreedValue.toLowerCase());
}); 

const addToFavorite = document.getElementById('addToFavorite');

addToFavorite.addEventListener('click', () => {
    console.log('add to fav');
});