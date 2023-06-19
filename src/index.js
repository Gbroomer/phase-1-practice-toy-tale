let addToy = false;
const addToySubmit = document.getElementsByClassName("add-toy-form")[0]
const addToyName = document.getElementsByClassName("input-text")[0]
const addToyURL = document.getElementsByClassName("input-text")[1]

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
    getToysFromServer()
})

addToySubmit.addEventListener("submit", (e) => {
  e.preventDefault()
  const newToy = {
    name: addToyName.value,
    image: addToyURL.value,
    likes: 0
  }
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newToy)
  })
  .then(res => res.json())
  .then((data) => {
    createToyCards([data])
  })
  .catch(err => {
    console.log('Error', err);
  })
  
  })
function getToysFromServer() {
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(data => createToyCards(data))
    .catch(err => {
      console.log('Error', err);
    })
  }
function createToyCards(toyData) {
    toyData.forEach((toy) => {

      const divBucket = document.createElement("div")
      divBucket.className = "card"

      const img = document.createElement("img")
      img.src = toy.image
      img.className = ("toy-avatar")

      const toyName = document.createElement("h2")
      toyName.textContent = toy.name

      const toyLikes = document.createElement("p")
      toyLikes.textContent =  `${toy.likes} likes!`

      const toyButton = document.createElement("button")
      toyButton.className = "like-btn"
      toyButton.id = toy.id
      toyButton.textContent = "Like ❤️"
      toyButton.addEventListener("click", () => {
        updateLikes(toy.id, toy.likes++)
          .then((updatedLikes) => {
            toyLikes.textContent = `${updatedLikes.likes} likes!`
            console.log("likes should update")
          })
          .catch((err) => {
            console.log("Error Updating", err)
          })
      })
      divBucket.append(toyName, img, toyLikes, toyButton)
      document.body.append(divBucket);
    })
}

function updateLikes(toy, newLikes) {
  return fetch(`http://localhost:3000/toys/${toy}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      likes: newLikes
    }),
  })
  .then((res) => res.json(), console.log("should have updated"))
  .catch((err) => {
    console.log("Error fetching Data", err)
  })
}
