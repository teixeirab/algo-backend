module.exports = function(FlexFundsDB, Sequelize) {
    return FlexFundsDB.define('quarterly_reporting_setup', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        pershing_start_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        pershing_end_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        ib_start_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        ib_end_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        citi_start_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        citi_end_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        navs_weekly_start_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        navs_weekly_end_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        navs_monthly_start_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        navs_monthly_end_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        usd_eur_begin: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        cad_eur_begin: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        gbp_eur_begin: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        usd_eur_end: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        cad_eur_end: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        gbp_eur_end: {
            type: Sequelize.DOUBLE,
            allowNull: false
        }
    }, {
        tableName: 'quarterly_reporting_setup'
    });
};