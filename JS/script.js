let addButton = document.querySelector(".container__content__button")


function addRow(){
    let tbody = document.querySelector("tbody")
    let tr = document.createElement("tr")
    let tdInputAuthor = document.createElement("td")
    let tdInputTitle = document.createElement("td")
    let tdButton = document.createElement("td")
    let buttonEdit = document.createElement("button")
    let buttonRemove = document.createElement("button")
    let inputAuthor = document.createElement("input")
    let inputTitle = document.createElement("input")

    inputAuthor.classList.add("input__text")
    inputTitle.classList.add("input__text")
    tdInputAuthor.appendChild(inputAuthor)
    tdInputTitle.appendChild(inputTitle)

    buttonEdit.classList.add("button", "button--secondary")
    buttonRemove.classList.add("button", "button--secondary")

    buttonRemove.addEventListener('click', () => tr.remove())

    buttonEdit.innerHTML = "Edit"
    buttonRemove.innerHTML = "Remove"
    tdButton.appendChild(buttonEdit)
    tdButton.appendChild(buttonRemove)

    tr.appendChild(tdInputAuthor)
    tr.appendChild(tdInputTitle)
    tr.appendChild(tdButton)

    tbody.appendChild(tr)
}

addButton.addEventListener('click', addRow)
