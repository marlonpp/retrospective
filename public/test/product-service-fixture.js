jasmine.getFixtures().fixturesPath = 'base/test/mock-data/advisor';

function ProductServiceFixture() {
    this.products = JSON.parse(readFixtures("products.json"));


    this.laptop1 = this.products[0];
    this.laptop1.quantity = 1;
    this.laptop2 = this.products[1];
    this.laptop2.quantity = 1;
    this.laptop3 = this.products[2];
    this.laptopWithOneImage = this.products[3];
    this.laptopWithNoProdSpecs = this.products[4];
    this.laptopWithNoProdAndSkuSpecs = this.products[5];
    this.tablet1 = this.products[6];

    this.getMockFilter = function () {
        return {
            "type": "display",
            "options": [
                {
                    "name": "Under 12\"",
                    "searchTerms": ["10.1", "11"]
                },
                {
                    "name": "12\"-13\"",
                    "searchTerms": ["12", "13"]
                },
                {
                    "name": "14\"-15\"",
                    "searchTerms": ["14", "15"]
                },
                {
                    "name": "16\"-17\"",
                    "searchTerms": ["16", "17"]
                }
            ]
        };
    };

    this.categoryList = {
        categories: [
            {
                name: Category.PERSONALSYSTEMS,
                subCategories: [
                    {
                        name: SubCategory.LAPTOP
                    }
                ]
            }
        ],
        "Personal Systems": {
            Laptop: {
                products: [this.laptop1, this.laptop2, this.laptopWithNoProdAndSkuSpecs],
                hmc: {
                    "1D2A3A": [
                        {
                            sku: "F1J74UT"
                        },
                        {
                            sku: "F2J07AA"
                        },
                        {
                            sku: "F2J07AA"
                        }
                    ],
                    "1D2A3B": [
                    ],
                    "1D2A4A": [
                        {
                            sku: "F2J07AA"
                        }
                    ],
                    "1A2C": [
                        {
                            sku: "F2J07AA"
                        }
                    ]
                },
                questions: [
                    {
                        text: "Question Number 1",
                        options: [
                            {
                                key: "1A",
                                text: "Option 1"
                            },
                            {
                                key: "1D",
                                text: "Option 4"
                            }
                        ]
                    },
                    {
                        text: "Question Number 2",
                        options: [
                            {
                                key: "2A",
                                text: "Option 1"
                            },
                            {
                                key: "2B",
                                text: "Option 2"
                            },
                            {
                                key: "2C",
                                text: "Option 3"
                            },
                        ]
                    },
                    {
                        text: "Question Number 3",
                        options: [
                            {
                                key: "3A",
                                text: "Option 1"
                            },
                            {
                                key: "3B",
                                text: "Option 2"
                            }
                        ]
                    },
                    {
                        text: "Question Number 4",
                        options: [
                            {
                                key: "4A",
                                text: "Option 1"
                            }
                        ]
                    }
                ],
                specsShortList: [
                    {
                        property: "Operating System property",
                        display: "Operating System display"
                    }
                ]
            }
        }
    };
}

function HMCFixture() {
    this.questions = [
        {
            group: "group 1",
            question: "Question Number 1",
            options: [
                {
                    key: "1A",
                    text: "Option 1"
                },
                {
                    key: "2A",
                    text: "Option 2"
                }
            ],
            selected: ""
        },
        {
            group: "group 2",
            question: "Question Number 2",
            options: [
                {
                    key: "2A",
                    text: "Option 1"
                },
                {
                    key: "2B",
                    text: "Option 2"
                }
            ],
            selected: ""
        }
    ];

    var products = JSON.parse(readFixtures("products.json"));
    this.recommendedSku = [
        {
            sku: "F2P75UT",
            caption: "Good Value",
            skuObject: products[0]
        }
    ]
}


var mock = (function () {
    var productServiceFixture = new ProductServiceFixture();
    var mockBrowserService = jasmine.createSpyObj('browserService', ['isIndexedDBSupported']);
    var mockBrowserDBService = jasmine.createSpyObj('browserDBService', ['getById', 'getByIndex', 'getAll', 'createIndex', 'insert']);

    return {
        productFixture: productServiceFixture,
        browserService: mockBrowserService,
        browserDBService: mockBrowserDBService,
        hmcFixture: new HMCFixture()
    }

})();