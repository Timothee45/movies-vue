export default {
	convertSqlDateToBasicOne(dateSql) {
      if (dateSql == null || dateSql.length < 10) {
        return "";
      } else {
        return dateSql.substring(8, 10) + "/" + dateSql.substring(5, 7) + "/" + dateSql.substring(0, 4);
      }
	}
}