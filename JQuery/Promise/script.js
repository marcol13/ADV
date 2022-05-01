const url = document.querySelector("#url");
const submit = document.querySelector("#submit");
const answer = document.querySelector("#answer");

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    console.log(path);
    fetch(path, {
      method: "GET"
    })
      .then((req) => {
        if (req.status == 200) {
          answer.innerHTML = "status 200";
          resolve(req);
        } else {
          answer.innerHTML = `status ${req.status}`;
          reject(req.status);
        }
      })
      .catch((error) => {
        answer.innerHTML = `error ${error}`;
        reject("error");
      });
  });
}

submit.addEventListener("click", async function () {
  let path = url.value;
  let requestPromise = await makeRequest(path);
  console.log(requestPromise);
});
