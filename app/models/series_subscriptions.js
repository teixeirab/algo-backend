/**
 * Created by becogontijo on 4/13/2017.
 */
module.exports = function(FlexFundsDB, Sequelize) {
    return FlexFundsDB.define('series_subscriptions', {
        id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        series_number: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        period: {
            type: Sequelize.DATE,
            allowNull: false
        },
        company_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        shares_purchased: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        purchase_price: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        transaction_type: {
            type: Sequelize.ENUM('DVP','DF'),
            allowNull: false
        }

    }, {
        tableName: 'series_subscriptions'
    });
};