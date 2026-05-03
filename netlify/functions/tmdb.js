exports.handler = async (event) => {
  const headers = { "Access-Control-Allow-Origin": "*" };
  const key = process.env.TMDB_API_KEY;
  const { id, query, year, type } = event.queryStringParameters || {};

  try {
    let url;
    if (id) {
      url = `https://api.themoviedb.org/3/${type || 'movie'}/${id}?api_key=${key}&language=it-IT`;
    } else if (query) {
      url = `https://api.themoviedb.org/3/search/${type || 'movie'}?api_key=${key}&query=${encodeURIComponent(query)}&year=${year || ''}&language=it-IT`;
    } else {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'missing params' }) };
    }

    const res = await fetch(url);
    const data = await res.json();

    // If search, return first result
    const result = data.results ? data.results[0] : data;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ poster_path: result?.poster_path || null })
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
