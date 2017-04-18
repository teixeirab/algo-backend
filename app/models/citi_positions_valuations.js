module.exports = function(FlexFundsDB, Sequelize) {
    return FlexFundsDB.define('citi_positions_valuations', {
        account_id: {
            type: Sequelize.STRING(11),
            allowNull: true
        },
        account_name: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        as_of_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        issue_name: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        maturity_date: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        sec_id_type: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        sec_id: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        settled_quantity: {
            type: "DOUBLE",
            allowNull: true
        },
        market_value: {
            type: "DOUBLE",
            allowNull: true
        },
        currency: {
            type: Sequelize.STRING(3),
            allowNull: true
        },
        interest_rate: {
            type: "DOUBLE",
            allowNull: true
        },
        isin: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        accrued_income: {
            type: Sequelize.DOUBLE,
            allowNull: true
        },
        asset_classification: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        asset_type: {
            type: Sequelize.STRING(5),
            allowNull: true
        },
        moodys_rating: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        cusip: {
            type: Sequelize.STRING(45),
            allowNull: true
        }
    }, {
        tableName: 'citi_positions_valuations'
    });
};
