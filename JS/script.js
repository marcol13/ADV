let addButton = document.querySelector(".container__content__button");

function addRow() {
	let tbody = document.querySelector("tbody");
	let tr = document.createElement("tr");
	let tdInputAuthor = document.createElement("td");
	let tdInputTitle = document.createElement("td");
	let tdButton = document.createElement("td");
	let buttonEdit = document.createElement("button");
	let buttonRemove = document.createElement("button");
	let inputAuthor = document.createElement("input");
	let inputTitle = document.createElement("input");
	let spanAuthor = document.createElement("span");
	let spanTitle = document.createElement("span");

	inputAuthor.classList.add("input__text");
	inputTitle.classList.add("input__text");
	tdInputAuthor.appendChild(inputAuthor);
	tdInputTitle.appendChild(inputTitle);

	buttonEdit.classList.add("button", "button--secondary");
	buttonRemove.classList.add("button", "button--secondary");

	buttonEdit.innerHTML = "Save";
	buttonRemove.innerHTML = "Remove";

	buttonEdit.addEventListener("click", function () {
		if (this.innerHTML == "Save") {
			this.innerHTML = "Edit";
			inputAuthor.replaceWith(spanAuthor);
			spanAuthor.innerHTML = inputAuthor.value;

			inputTitle.replaceWith(spanTitle);
			spanTitle.innerHTML = inputTitle.value;
		} else {
			this.innerHTML = "Save";
			spanAuthor.replaceWith(inputAuthor);
			inputAuthor.value = spanAuthor.innerHTML;

			spanTitle.replaceWith(inputTitle);
			inputTitle.value = spanTitle.innerHTML;
		}
	});
	buttonRemove.addEventListener("click", () => tr.remove());

	tdButton.appendChild(buttonEdit);
	tdButton.appendChild(buttonRemove);

	tr.appendChild(tdInputAuthor);
	tr.appendChild(tdInputTitle);
	tr.appendChild(tdButton);

	tbody.appendChild(tr);
}

addButton.addEventListener("click", addRow);
