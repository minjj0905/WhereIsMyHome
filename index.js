const moveSign = () => {
  window.location.href = '/signin.html';
};

const login = () => {
  const id = document.getElementById('loginid').value;
  const pw = document.getElementById('loginpw').value;

  const user = { id, pw, pwcheck: null, address: null, phone: null };
  localStorage.setItem('user', JSON.stringify(user));
  window.location.reload();
};

const signup = () => {
  const id = document.getElementById('upid').value;
  const pw = document.getElementById('uppw').value;
  const pwcheck = document.getElementById('uppwck').value;
  const address = document.getElementById('upaddress').value;
  const phone = document.getElementById('upphone').value;

  const user = { id, pw, pwcheck, address, phone };

  localStorage.setItem('user', JSON.stringify(user));
  window.location.href = '/index.html';
};

const checkLogin = () => {
  if (!localStorage.getItem('user')) return;

  document.getElementById('loginBtn').innerHTML = '로그아웃';
  document.getElementById('loginBtn').onclick = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };
};

window.onload = function () {
  checkLogin();
};

const search = () => {
  const pageNo = 1;
  const numOfRows = 10;

  const gugunSel = document.querySelector('#gugun');
  const regCode = gugunSel[gugunSel.selectedIndex].value.substr(0, 5);

  const yearSel = document.querySelector('#year');
  const year = yearSel[yearSel.selectedIndex].value;
  const monthSel = document.querySelector('#month');
  const month = monthSel[monthSel.selectedIndex].value;
  const dealYM = year + month;

  const key =
    'ytDs%2B%2FVKSAwYlWnI3NoOv6SLraVlQ0%2F6jvroGtzyAzmdtx3yXPgkslB2EcTM9H%2BTaGq8wu7DEEZcFwf6MCMSuQ%3D%3D';

  const parameter = `&pageNo=${pageNo}&numOfRows=${numOfRows}&LAWD_CD=${regCode}&DEAL_YMD=${dealYM}`;

  fetch(
    `http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev?serviceKey=${key}` +
      parameter
  )
    .then((response) => response.text())
    .then((str) => new DOMParser().parseFromString(str, 'application/xml'))
    .then((xml) => {
      const aparts = xmlToJson(xml)?.response?.body?.items.item;
      updateSearchResult(aparts);
    });
};

const updateSearchResult = (aparts) => {
  document.getElementById('no-result').style.display = 'none';

  for (key in aparts) {
    const item = aparts[key];

    const name = item['아파트']['#text'];
    const price = item['거래금액']['#text'].trim();
    const area = item['전용면적']['#text'].trim();
    const date = `${item['년']['#text']}년 ${item['월']['#text']}월 ${item['일']['#text']}일`;
    const floor = item['층']['#text'];

    const card = document.createElement('div');
    card.className = 'card w-96 bg-base-100 shadow-sm';

    const cardbody = document.createElement('div');
    cardbody.className = 'card-body';

    const title = document.createElement('h2');
    title.className =
      'card-title flex w-full justify-between cursor-pointer flex-wrap';

    const leftTitle = document.createElement('div');
    const apartname = document.createElement('span');
    apartname.className = 'text-indigo-900 mr-[6px]';
    apartname.textContent = name;
    const floorspan = document.createElement('span');
    floorspan.className = 'text-sm';
    floorspan.textContent = `${floor}층`;
    leftTitle.appendChild(apartname);
    leftTitle.appendChild(floorspan);

    const badge = document.createElement('div');
    badge.className = 'badge badge-ghost font-normal';
    badge.textContent = date;
    title.appendChild(leftTitle);
    title.appendChild(badge);
    cardbody.appendChild(title);

    const priceP = document.createElement('p');
    const pricetitle = document.createElement('span');
    pricetitle.textContent = '거래금액';
    pricetitle.className = 'text-indigo-800 font-medium mr-[10px]';
    priceP.appendChild(pricetitle);
    const pricespan = document.createElement('span');
    pricespan.textContent = price + '만원';
    priceP.appendChild(pricespan);
    cardbody.appendChild(priceP);

    const areaP = document.createElement('p');
    const areatitle = document.createElement('span');
    areatitle.textContent = '전용면적';
    areatitle.className = 'text-indigo-800 font-medium mr-[10px]';
    areaP.appendChild(areatitle);
    const areaspan = document.createElement('span');
    areaspan.textContent = area + '평';
    areaP.appendChild(areaspan);
    cardbody.appendChild(areaP);

    card.appendChild(cardbody);

    document.getElementById('search-result').appendChild(card);
  }
};

function xmlToJson(xml) {
  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof obj[nodeName] == 'undefined') {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push == 'undefined') {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}
