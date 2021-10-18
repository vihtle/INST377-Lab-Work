const mymap = L.map('mapid').setView([39, -77], 13);
function mapInit() {
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic291cGVybXVuc3RlciIsImEiOiJja3VyNG42M3EwemZhMnhwZ2NzbTlxMjU0In0.vzkMCOweTEzFXDoEd46DQw'
  }).addTo(mymap);
}
mapInit();

async function dataHandler() {
  const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';

  const request = await fetch(endpoint);
  const zip = await request.json();
  // fetch(endpoint)
  //   .then(blob => blob.json())
  //   .then(data => names.push(...data));

  function findMatches(wordToMatch, zip) {
    return zip.filter((info) => {
      const regex = new RegExp(wordToMatch, 'gi');
      return info.zip.match(regex);
    });
  }
  function displayMatches(event) {
    const matchArray = findMatches(event.target.value, zip);
    const splitMatchArray = matchArray.slice(0, 5);
    console.log(searchInput)
    if (searchInput.value === '') {
      splitMatchArray.length = 0;
    }
    const html = splitMatchArray.map((info) => {
      const regex = new RegExp(event.target.value, 'gi');
      const resZip = info.zip.replace(regex, `<span class="hl">${event.target.value}</span>`);
      return `
      <div class="box">
      <li>
        <div class="name">${info.name}</div>
        <div class="add1">${info.address_line_1}</div>
        <span class="city">${info.city}</span> <span class="state">${info.state}</span>
        <span class="zip">${resZip}</span>
      </li>
      </div>
    `;
    }).join('');
    // make markerarray = the splitmatcharray markers
    splitMatchArray.forEach((info) => {
      const point = info.geocoded_column_1;
      if (!point || !point.coordinates) {
        return;
      }
      const latLong = point.coordinates;
      const marker = latLong.reverse();
      L.marker(marker).addTo(mymap);
      mymap.setView(marker, 10);
    });
    suggestions.innerHTML = html;
  }

  const searchInput = document.querySelector('.search');
  const suggestions = document.querySelector('.suggestions');

  //searchInput.addEventListener('change', displayMatches);
  //searchInput.addEventListener('keyup', (evt) => { displayMatches(evt); });
  searchInput.addEventListener('input', displayMatches);
}
window.onload = dataHandler;
