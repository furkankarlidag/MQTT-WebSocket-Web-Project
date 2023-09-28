async  function ekleDB(macAdress, time) {
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'furkan1158',
      database: "macAdres",
    });
    await client.connect();
  
    const text = 'INSERT INTO devices(dmac, time) VALUES($1 , $2) RETURNING *';
    const values = [macAdress, time];
  
    try {
      const res = await client.query(text, values);
      console.log('Inserted device:', res.rows[0]);
    } finally {
      await client.end();
    }
  }
  
  const deleteRows = async (mac) => {
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'furkan1158',
      database: "macAdres",
    });
  
    const query = `DELETE FROM "devices" WHERE "dmac" = $1;`;
    try {
      await client.connect();
      await client.query(query, [mac]);
    } catch (error) {
      console.error(error.stack);
    } finally {
      await client.end();
    }
  };

  module.exports = {ekleDB, deleteRows};