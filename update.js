window.onload = () => {
  checkLogin();
  const user = JSON.parse(localStorage.getItem('user'));
  const id = document.getElementById('upid');
  const pw = document.getElementById('uppw');
  const address = document.getElementById('upaddress');
  const phone = document.getElementById('upphone');

  if (user.id) id.value = user.id;
  if (user.pw) pw.value = user.pw;
  if (user.address) address.value = user.address;
  if (user.phone) phone.value = user.phone;
};

const updateUser = () => {
  const id = document.getElementById('upid').value;
  const pw = document.getElementById('uppw').value;
  const address = document.getElementById('upaddress').value;
  const phone = document.getElementById('upphone').value;

  const user = { id, pw, address, phone };
  localStorage.removeItem('user');
  localStorage.setItem('user', JSON.stringify(user));
  window.location.href = '/index.html';
};

const deleteUser = () => {
  localStorage.removeItem('user');
  window.location.href = '/index.html';
};
