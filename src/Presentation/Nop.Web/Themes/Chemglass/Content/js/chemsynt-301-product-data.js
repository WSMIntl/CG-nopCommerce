(function () {
  'use strict';

  const imageRoot = '/Themes/Chemglass/Content/chemsynt-301/images/';
  const accessories = [
    ['A00000551', 'Glassware kit 400mL for ChemSynt 301', 'a00000551-334599.jpg'],
    ['A00000552', 'Glassware kit 100mL for ChemSynt 301', 'a00000552-334601.jpg'],
    ['A00000558', 'OHS RS Digital', 'a00000558-2-334039.jpg'],
    ['A00000567', 'PTFE Shaft Stirrer, Centrifugal 8x300mm', 'a00000567-334061.jpg'],
    ['A00000568', 'PTFE Stirrer Shaft, Retreat Curv 8x300mm', 'a00000568-334083.jpg'],
    ['A00000569', 'PTFE Shaft Stirrer, Screw Propel 8x300mm', 'a00000569-334085.jpg'],
    ['A00000573', 'OHS Adapter Cone for 100mL Vessel', 'default-product-image.jpg'],
    ['A00000559', 'DU 50 Dosing Unit', 'single-dosing-unit-335481.jpg'],
    ['A00000560', 'DU 50 Double - Dosing Unit', 'double-dosing-unit-335513.jpg'],
    ['A00000565', '25mL syringe', 'a00000565-334152.jpg'],
    ['A00000570', '50mL syringe', 'a00000570-334174.jpg'],
    ['A00000572', 'Glass pt100 probe Ø5 ChemSynt 301', 'a00000572-334731.jpg'],
    ['A00000553', 'PTFE pt100 probe Ø8 ChemSynt 301', 'a00000553-333973.jpg'],
    ['A00000587', 'AISI 316 Ti pt100 probe Ø3 ChemSynt 301', 'a00000268-211748-1-335046.jpg'],
    ['A00000562', 'pH electrode; BNC connector - 320mm', 'a00000562-333839.jpg'],
    ['A00000556', 'Dropping Funnels 100mL; SJ: 14/23', 'a00000556-333885.jpg'],
    ['A00000557', 'Condenser coil 200mm; SJ: 14/23', 'a00000557-333887.jpg'],
    ['A00000566', 'Ø16 Vial Adapter for ChemSynt 301', 'a00000566-335018.jpg'],
    ['CM0091680', 'Set of 20 glass test tubes Ø 16 mm', 'confezione-20-provette-in-vetro-16-mm-190477.jpg'],
    ['A00000574', 'D8mm 14/20 probe adapter', 'tappo-a00000574-335016.jpg'],
    ['A00000575', 'D12mm 14/20 probe adapter', 'default-product-image.jpg'],
    ['A00000576', 'D3mm 14/20 probe adapter', 'tappo-a00000576-335014.jpg'],
    ['A00000577', 'PTFE stopper 14/20', 'tappo-a00000577-335056.jpg'],
    ['A00000578', 'PTFE stopper 10/18', 'tappo-a00000578-335058.jpg'],
    ['A00000579', 'PTFE stopper 19/22', 'tappo-a00000579-335060.jpg'],
    ['A00000580', 'Keck clamp J10', 'default-product-image.jpg'],
    ['A00000581', 'Keck clamp J14', 'default-product-image.jpg'],
    ['A00000582', 'Keck clamp J19', 'default-product-image.jpg'],
    ['A00000583', 'Glass stopper 14/23', 'default-product-image.jpg'],
    ['A00000584', 'Glass stopper 19/26', 'default-product-image.jpg'],
    ['A00000585', 'Glass stopper 10/18', 'default-product-image.jpg'],
    ['A00000352', 'Magnetic cross shape stir bar, Ø20x8 mm', 'ancoretta-magnetica-a-croce-20x8-mm-198877.jpg'],
    ['A00000355', 'Magnetic disc stir bar, Ø20x10 mm', 'ancoretta-magnetica-a-disco-20x10-mm-199032.jpg'],
    ['A00001063', 'Magnetic stir bar, Ø4,5x12 mm', 'ancoretta-magnetica-45x12-mm-190553.jpg'],
    ['A00001057', 'Magnetic stir bar Ø6x20mm', 'ancoretta-magnetica-6x20mm-190565.jpg'],
    ['A00000336', 'Magnetic cross shape stir bar, Ø10x5 mm', 'ancoretta-magnetica-a-croce-10x5-mm-198866.jpg'],
    ['A00000586', 'PTFE Stir Bar Retriever 350mm', 'a00000586-335022.jpg'],
    ['A00000549', 'Support Kit ChemSynt 301', 'a00000549-333753.jpg'],
    ['A00000555', 'Clamp for accessories ChemSynt 301', 'a00000555-333817.jpg'],
    ['A00000561', 'Flowmeter pair kit', 'a00000561-333795.jpg'],
    ['A00000563', 'Hydraulic/pneumatic slave expansion kit', 'a00000563-333995.jpg'],
    ['A00000564', 'Hydraulic insulation kit', 'a00000564-333997.jpg'],
    ['A00000351', 'Handle for Block removal', 'maniglia-per-rimozione-alublock-198933.jpg'],
    ['A00000391', 'ControllerSoft', 'Controllerpc-312984.jpg'],
    ['E00010012', 'VELP Ermes 1 year Connection', 'digitale1year-100-314804.jpg'],
    ['E00010036', 'VELP Ermes 3 years Connection', 'digitale3years-100-314802.jpg']
  ].reduce((result, [code, name, image]) => {
    result[code] = { code, name, image: imageRoot + image };
    return result;
  }, {});

  const leaderOptional = [
    'A00000558', 'A00000567', 'A00000568', 'A00000569', 'A00000573', 'A00000559',
    'A00000560', 'A00000565', 'A00000570', 'A00000562', 'A00000556', 'A00000557',
    'CM0091680', 'A00000574', 'A00000575', 'A00000576', 'A00000577', 'A00000578',
    'A00000579', 'A00000580', 'A00000581', 'A00000582', 'A00000583', 'A00000584',
    'A00000585', 'A00000352', 'A00000355', 'A00001063', 'A00001057', 'A00000336',
    'A00000586', 'A00000549', 'A00000555', 'A00000561', 'A00000563', 'A00000564',
    'A00000351', 'A00000391', 'E00010012', 'E00010036'
  ];

  const slaveOptional = [
    'A00000551', 'A00000552', 'A00000558', 'A00000567', 'A00000568', 'A00000569',
    'A00000573', 'A00000559', 'A00000560', 'A00000565', 'A00000570', 'A00000572',
    'A00000553', 'A00000562', 'A00000556', 'A00000557', 'A00000566', 'CM0091680',
    'A00000577', 'A00000579', 'A00000583', 'A00000584', 'A00000585', 'A00000578',
    'A00000580', 'A00000581', 'A00000582', 'A00000355', 'A00001063', 'A00001057',
    'A00000336', 'A00000352', 'A00000586', 'A00000549', 'A00000555', 'A00000561',
    'A00000563', 'A00000564', 'A00000351', 'A00000574', 'A00000575', 'A00000576',
    'A00000391', 'E00010012', 'E00010036'
  ];

  const models = [
    {
      id: 5643,
      code: 'SA110A0710',
      name: 'ChemSynt 301 Chemical Synthesis Reactor',
      image: imageRoot + 'chemsynt-3-4-sinistra-sa-335599.jpg',
      details: [
        'F110A0710 ChemSynt 301 without CP',
        'A00000539 ControlPad',
        'A00000549 Support Kit',
        'A00000561 Flowmeter Kit',
        'A00000555 Accessory Clamp'
      ],
      groups: [
        { title: 'Included accessories', type: 'included', codes: ['A00000561', 'A00000555', 'A00000549'] },
        { title: 'Required accessories', type: 'required', codes: ['A00000551', 'A00000552', 'A00000566', 'A00000553', 'A00000572', 'A00000587'] },
        { title: 'Optional accessories', type: 'optional', codes: leaderOptional }
      ]
    },
    {
      id: 5644,
      code: 'F110A0710',
      name: 'ChemSynt 301 Chemical Reaction Station no CP',
      image: imageRoot + 'chemsynt-3-4-unit-335479.jpg',
      details: [
        'A00000563 Hydraulic/Pneumatic Expansion Kit',
        'A00000287 Slave Connection Cable'
      ],
      groups: [
        { title: 'Optional accessories', type: 'optional', codes: slaveOptional }
      ]
    }
  ];

  const countries = 'Afghanistan|Aland Islands|Albania|Algeria|Andorra|Angola|Anguilla|Antigua and Barbuda|Argentina|Armenia|Aruba|Australia|Austria|Azerbaijan|Bahamas|Bahrain|Bangladesh|Barbados|Belarus|Belgium|Belize|Benin|Bermuda|Bhutan|Bolivia|Bonaire, Sint Eustatius and Saba|Bosnia and Herzegovina|Botswana|Brazil|British Indian Ocean Territory|British Virgin Islands|Brunei Darussalam|Bulgaria|Burkina Faso|Burundi|Cambodia|Cameroon|Canada|Cape Verde|Cayman Islands|Central African Republic|Chad|Chile|China|Christmas Island|Cocos (Keeling) Islands|Colombia|Comoros|Congo Democratic Republic|Congo Republic|Cook Islands|Costa Rica|Croatia|Cuba|Curacao|Cyprus|Czech Republic|Denmark|Djibouti|Dominica|Dominican Republic|Ecuador|Egypt|El Salvador|Equatorial Guinea|Eritrea|Estonia|Eswatini|Ethiopia|Falkland Islands|Faroe Islands|Fiji|Finland|France|French Guiana|French Polynesia|Gabon|Gambia|Georgia|Germany|Ghana|Gibraltar|Greece|Greenland|Grenada|Guadeloupe|Guam|Guatemala|Guernsey|Guinea|Guinea-Bissau|Guyana|Haiti|Honduras|Hong Kong|Hungary|Iceland|India|Indonesia|Iran|Iraq|Ireland|Isle of Man|Israel|Italy|Ivory Coast|Jamaica|Japan|Jersey|Jordan|Kazakhstan|Kenya|Kiribati|Kosovo|Kuwait|Kyrgyzstan|Laos|Latvia|Lebanon|Lesotho|Liberia|Libya|Liechtenstein|Lithuania|Luxembourg|Macao|Madagascar|Malawi|Malaysia|Maldives|Mali|Malta|Marshall Islands|Martinique|Mauritania|Mauritius|Mayotte|Mexico|Micronesia|Moldova|Monaco|Mongolia|Montenegro|Montserrat|Morocco|Mozambique|Myanmar|Namibia|Nauru|Nepal|Netherlands|New Caledonia|New Zealand|Nicaragua|Niger|Nigeria|Niue|Norfolk Island|North Korea|North Macedonia|Northern Mariana Islands|Norway|Oman|Pakistan|Palau|Palestine|Panama|Papua New Guinea|Paraguay|Peru|Philippines|Pitcairn|Poland|Portugal|Puerto Rico|Qatar|Reunion|Romania|Russian Federation|Rwanda|Saint Barthelemy|Saint Helena|Saint Kitts and Nevis|Saint Lucia|Saint Martin|Saint Pierre and Miquelon|Saint Vincent and the Grenadines|Samoa|San Marino|Sao Tome and Principe|Saudi Arabia|Senegal|Serbia|Seychelles|Sierra Leone|Singapore|Sint Maarten|Slovakia|Slovenia|Solomon Islands|Somalia|South Africa|South Korea|South Sudan|Spain|Sri Lanka|Sudan|Suriname|Svalbard and Jan Mayen|Sweden|Switzerland|Syria|Taiwan|Tajikistan|Tanzania|Thailand|Timor-Leste|Togo|Tokelau|Tonga|Trinidad and Tobago|Tunisia|Turkey|Turkmenistan|Turks and Caicos Islands|Tuvalu|Uganda|Ukraine|United Arab Emirates|United Kingdom|United States|Uruguay|US Virgin Islands|Uzbekistan|Vanuatu|Vatican City|Venezuela|Vietnam|Wallis and Futuna|Western Sahara|Yemen|Zambia|Zimbabwe'.split('|');

  const provinces = {
    'United States': 'Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|District of Columbia|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming'.split('|'),
    Canada: 'Alberta|British Columbia|Manitoba|New Brunswick|Newfoundland and Labrador|Northwest Territories|Nova Scotia|Nunavut|Ontario|Prince Edward Island|Quebec|Saskatchewan|Yukon'.split('|'),
    Australia: 'Australian Capital Territory|New South Wales|Northern Territory|Queensland|South Australia|Tasmania|Victoria|Western Australia'.split('|')
  };

  const industries = [
    ['1', 'Academia, Research & Government'],
    ['2', 'Chemical & Petrochemical'],
    ['3', 'Commercial Labs'],
    ['4', 'Cosmetics & Personal Care'],
    ['5', 'Environmental & Agro'],
    ['6', 'Food, Feed & Beverage'],
    ['7', 'Pharmaceutical & Life science'],
    ['8', 'Pulp, Paper & Textile']
  ];

  const sectors = {
    '1': ['Academia & University', 'Government Authorities', 'Other'],
    '2': ['Other', 'Paints & Reagents', 'Pesticides', 'Petrochemicals, Oil & Gas', 'Rubber, Plastic & Polymers'],
    '3': [],
    '4': [],
    '5': ['Biomass, Leaves & Plants', 'Fertilizers', 'Other', 'Soil, Sludge & Sediment', 'Waste', 'Water & Wastewater'],
    '6': ['Bakery', 'Beer, Spirits & Wines', 'Cereals, Grains & Seeds', 'Cream, Sauce & Soup', 'Fats & Oils', 'Feed', 'Fruits & Vegetables', 'Meat & Seafood', 'Milk & Dairy Products', 'Nuts & Dried Fruits', 'Other', 'Pet Food', 'Plant-based & Alternative Proteins', 'Ready Meals & Packaging', 'Snacks', 'Soft Drinks & Juices'],
    '7': ['Biotechnological Samples', 'Medical Samples & Biomaterials', 'Other', 'Pharmaceuticals'],
    '8': ['Pulp & Paper', 'Textile']
  };

  window.CHEMSYNT_DATA = { accessories, models, countries, provinces, industries, sectors };
}());
