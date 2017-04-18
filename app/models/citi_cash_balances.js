module.exports = function(FlexFundsDB, Sequelize) {
    return FlexFundsDB.define('citi_cash_balances', {
        currency: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        account_id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        account_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        period: {
            type: Sequelize.DATE,
            allowNull: false
        },
        opening_balance: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        ledger_balance: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        available_balance: {
            type: Sequelize.DECIMAL,
            allowNull: true
        }
    }, {
        tableName: 'citi_cash_balances'
    });
};