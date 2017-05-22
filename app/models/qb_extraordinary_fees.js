module.exports = function(FlexFundsDB, Sequelize) {
    let model = FlexFundsDB.define('qb_extraordinary_fees', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        client_name: {
            type: Sequelize.STRING
        },
        series_number: {
            type: Sequelize.STRING,
            allowNull: false
        },
        type: {
            type: Sequelize.ENUM('Amendment: EUR 3500', 'Amendment: EUR 7000', 'Tranche: EUR 500', 'Pre-Issuance Amendment: EUR 1000', 'Pre-Issuance Amendment: EUR 500'),
            allowNull: false
        },
        memo: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        tableName: 'qb_extraordinary_fees'
    });
    return model
};