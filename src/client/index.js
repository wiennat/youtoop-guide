import "materialize-css/dist/css/materialize.css";
import "materialize-css/dist/js/materialize.js";
import "./main.css";
import fetch from "isomorphic-fetch";
import soundcloudLogo from "./img/soundclound.png";

const KEY_ENTER = 13;
document.addEventListener("DOMContentLoaded", function (event) {
  const searchTxt = document.getElementById("searchTxt");
  const keywordSpan = document.getElementById("keywordSpan");
  searchTxt.addEventListener("keypress", (ev) => {
    if (ev.which === KEY_ENTER) {
      const keyword = ev.target.value;
      const form = "keyword=" + encodeURIComponent(keyword);
      fetch('/api/search', {
          method: "POST",
          headers: {
            "Accept": "application/json, application/xml, text/plain, text/html, *.*",
            "Content-Type": 'application/x-www-form-urlencoded; charset=utf-8'
          },
          body: form
        })
        .then(res => {
          return res.json()
        })
        .then(json => {
          const keywordSpan = document.getElementById("keywordSpan");
          keywordSpan.innerText = `ค้นคำว่า ${keyword} เจอทั้งหมด ${json.length} เรื่อง`;
          showResultTable(json);
        })
    }
  });
});


function showResultTable(json) {
  const resultPanel = document.getElementById('resultPanel');
  const tableHeader = `<tr>
    <th>No.</th>
    <th>EP</th>
    <th>ช่วง</th>
    <th>คนเล่า</th>
    <th>รายละเอียด</th>
    <th>ฟัง</th>
  </tr>`;
  const tableRows = json.map((story, idx) => `<tr>
      <td>${idx + 1}</td>
      <td>${story.name}</td>
      <td>${story.part}</td>
      <td>${story.narrator}</td>
      <td>${story.description}</td>
      <td>
        <a href="https://soundcloud.com/gettalks/youtoop-${story.ep}#t=${story.epTime}" target="_blank">
          <img id="image" src="/assets/${soundcloudLogo}" width="32" height="32" alt="ฟังบน Soundcloud">
        </a>
      </td>
    </tr>`);

  const generatedString = `<table>
    <thead>${tableHeader}</thead>
    <tbody>${tableRows.join("")}</tbody>
    </table>`;
  resultPanel.innerHTML = generatedString;
}
