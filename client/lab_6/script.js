
async function windowActions() {
const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';


const request = await fetch(endpoint)
const names = await request.json()
// fetch(endpoint)
//   .then(blob => blob.json())
//   .then(data => names.push(...data));

function findMatches(wordToMatch, names) {
  return names.filter(info => {
    const regex = new RegExp(wordToMatch, 'gi');
    return info.name.match(regex)
  });
}
function displayMatches(event) {
  const matchArray = findMatches(event.target.value, names);
  const html = matchArray.map(info => {
    const regex = new RegExp(event.target.value, 'gi');
    const resName = info.name.replace(regex, `<span class="hl">${event.target.value}</span>`);
    return `
      <li>
        <div class="name">${resName}</div>
        <div class="add1">${info.address_line_1}</div>
        <span class="city">${info.city}</span> <span class="state">${info.state}</span>
        <span class="zip">${info.zip}</span>
      </li>
    `;
  }).join('');
  suggestions.innerHTML = html;
}

const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', (evt) => { displayMatches(evt) });
}
window.onload = windowActions;
