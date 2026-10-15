
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number || 0);
}


function redirectWith(res, path, type, message) {
  res.redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}


function getErrorMessage(error) {
  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    return error.errors.map(e => e.message).join(', ');
  }
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return 'Jasa tidak bisa dihapus karena sudah pernah dipesan';
  }
  return error.message;
}

module.exports = { formatRupiah, redirectWith, getErrorMessage };