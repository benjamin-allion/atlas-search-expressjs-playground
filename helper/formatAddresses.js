/**
 * Format Array of address object to Array of string
 * Ex : [{"postalCode":21520,"line1":"282","line2":"Avenue des Rosiers","city":"LES GOULLES"}]
 *   -> ["282 Avenue des Rosiers 21520 LES GOULLES"}]
 * @param addresses
 */
const formatAddresses = (addresses) => {
    return addresses.map(address => {
        return `${address.line1} ${address.line2} ${address.postalCode} ${address.city}`
    })
}

module.exports = { formatAddresses }
