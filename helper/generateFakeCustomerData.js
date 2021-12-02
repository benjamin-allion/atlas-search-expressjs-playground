const franceCities = require('./data/france.json')
const Fakerator = require("fakerator");
const fakerator = Fakerator("fr-FR");
const { formatAddresses } = require ('./formatAddresses')

const MAX_NUMBER_OF_ADDRESSES = 2
const MAX_NUMBER_OF_PHONE_NUMBERS = 2

/**
 * Generate specified number of fake customer (French)
 * @param {number} numberOfCustomers
 * @return {Array<{addresses: Array<{city, postalCode, line2: *, line1: *}>, addressesStr: Array<string>, identity: {firstName, lastName}, enable: boolean, phoneNumbers: [], email: string}>}
 */
const generateFakeCustomersData = (numberOfCustomers) => {
    const customers = []
    for(let i=0; i<numberOfCustomers; i++){
        customers.push(generateFakeCustomer())
    }
    return customers
}

/**
 * Generate single fake customer (French)
 * @returns {{firstName: *, lastName: *, addresses: Array<{city, postalCode, line2: *, line1: *}>, postalCodes: string[], enable: *, addressesStr, phoneNumbers: *[], email: string}}
 */
const generateFakeCustomer = () => {
    const identity = {
        firstName: fakerator.names.firstName(),
        lastName: fakerator.names.lastName(),
    }
    const addresses = generateAddresses(MAX_NUMBER_OF_ADDRESSES)
    const phoneNumbers = generatePhoneNumbers(MAX_NUMBER_OF_PHONE_NUMBERS)
    const email = generateEmail(identity)
    return {
        ...identity,
        addresses,
        addressesStr: formatAddresses(addresses),
        postalCodes: addresses.map( address => `${address.postalCode}`),
        phoneNumbers,
        email,
        enable: fakerator.random.boolean(),
    };
}

/**
 * Generate multiple random french addresses (between 1 & 'maxNumberOfAddress')
 * @param {number} maxNumberOfAddresses
 * @return {Array<{city, postalCode, line2: *, line1: *}>}
 */
const generateAddresses = (maxNumberOfAddresses) => {
    const numberOfAddressToGenerate = fakerator.random.number(1, maxNumberOfAddresses)
    let generatedAddresses = []
    for(let i=0; i<numberOfAddressToGenerate; i++){
        const generatedAddress = generateAddress()
        generatedAddresses.push(generatedAddress)
    }
    return generatedAddresses
}

/**
 * Generate single random french address
 * @return {{city, postalCode, line2: *, line1: *}}
 */
const generateAddress = () => {
    const randomCityInfos = franceCities[Math.floor(Math.random()* franceCities.length)];
    const postalCode = `${randomCityInfos['Code_postal']}`;
    const city = randomCityInfos['Nom_commune'];
    const generatedAddress = {
        postalCode,
        line1: fakerator.address.buildingNumber(),
        line2: fakerator.address.streetName(),
        city: city,
    }
    return generatedAddress
}

/**
 * Generate multiple random french phone numbers (between 1 & 'maxNumberOfPhoneNumbers')
 * @param {number} maxNumberOfPhoneNumbers
 */
const generatePhoneNumbers = (maxNumberOfPhoneNumbers) => {
    const numberOfPhoneNumberToGenerate = fakerator.random.number(1, maxNumberOfPhoneNumbers)
    let generatedNumbers = []
    for(let i=0; i<numberOfPhoneNumberToGenerate; i++) {
        const phoneNumber = `06${Math.floor(10000000 + Math.random() * 90000000)}`
        generatedNumbers.push(phoneNumber)
    }
    return generatedNumbers
}

const generateEmail = (customerIdentity) => {
    const firstName = customerIdentity.firstName.replace(/[\u0300-\u036f]/g, "").toLowerCase()
    const lastName = customerIdentity.lastName.replace(/[\u0300-\u036f]/g, "").toLowerCase()
    const generationProcessNumber = fakerator.random.number(2)

    switch(generationProcessNumber){
        case 0: {
            const randomValue = Math.floor(100 + Math.random() * 900)
            return `${firstName}.${lastName}@meetup${randomValue}.com`
        }
        case 1: {
            const randomValue = Math.floor(100 + Math.random() * 900)
            return `${lastName}${randomValue}@other.com`
        }
        default: {
            const randomValue = Math.floor(100 + Math.random() * 900)
            return `${firstName}${lastName.substring(0,3)}${randomValue}@new.com`
        }
    }
}

module.exports = { generateFakeCustomersData }
