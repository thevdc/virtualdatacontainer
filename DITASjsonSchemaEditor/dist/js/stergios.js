
$(function() {

	var VDCBlueprint = {
		'INTERNAL_STRUCTURE': {},
		'DATA_MANAGEMENT': null,
		'ABSTRACT_PROPERTIES': {},
		'COOKBOOK_APPENDIX': {},
		'EXPOSED_API': {}
	}

	function validateJSONData(item, isSave, itemType) {
		item = $(item)
		if (!item) {
			// console.log(1)
			return false
		}

		if (typeof isSave == 'string') {
			itemType = isSave
			isSave = false
		}

		if (!item.data('type')) {
			var children = $(item).children()
			var isValid = true
			for (var i = children.length - 1; i >= 0; i--) {
				if (!validateJSONData(children[i], isSave)) {
					isValid = false
				}
			}
			// console.log(1.1, isValid)
			return isValid
		}

		itemType = itemType || item.data('type')

		if (!itemType || itemType == 'any' || itemType == 'checkboxString') {
			return true
		}

		if (itemType.includes(',')) {
			var types = itemType ? itemType.split(',') : []
			for (var i = types.length - 1; i >= 0; i--) {
				if (validateJSONData(item, isSave, types[i])) {
					return true
				}
			}
			// console.log(2)
			return false
		}
		// console.log(item, isSave, itemType, item.data('validation'))
		if (itemType == 'bool') {
			if (item.data('type-input') && item.data('type-input').toLowerCase() === 'text') {
				var value = item.find('input').val()
				// console.log(3,value && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false'))
				return value && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')
			} else {
				return true
			}
		} else if (itemType == 'string') {
			var value = item.find('input').val() || item.find('select').val() || item.find('textarea').val() || item.data('default-value')
			var validations = item.data('validation') ? item.data('validation').split(',') : []
			for (var i = validations.length - 1; i >= 0; i--) {
				var validation = validations[i]
				if (validation == 'requiredIfVisible' && $(item).is(':visible')) {
					validation = 'required'
				}
				if (validation == 'required') {
					if (!value || !value.trim().length) {
						item.find('input').addClass('is-invalid')
						item.find('.input-group-append').addClass('is-invalid')
						item.find('label').addClass('text-danger')
						// console.log(4)
						return false
					} else {
						item.find('input').removeClass('is-invalid')
						item.find('.input-group-append').removeClass('is-invalid')
						item.find('label').removeClass('text-danger')
					}
				}
			}
			return true
		} else if (itemType == 'int') {
			var value = item.find('input').val()
			var validations = item.data('validation') ? item.data('validation').split(',') : []
			for (var i = validations.length - 1; i >= 0; i--) {
				var validation = validations[i]
				if (validation == 'required') {
					if (!value || !value.trim().length || Number.isNaN(parseInt(value.trim()))) {
						item.find('input').addClass('is-invalid')
						item.find('.input-group-append').addClass('is-invalid')
						item.find('label').addClass('text-danger')
						// console.log(5)
						return false
					} else {
						item.find('input').removeClass('is-invalid')
						item.find('.input-group-append').removeClass('is-invalid')
						item.find('label').removeClass('text-danger')
					}
				} else if (validation.startsWith('min-')) {
					var minimumVal = parseInt(validation.replace('min-',''))
					if (!Number.isNaN(minimumVal) && !Number.isNaN(parseInt(value.trim())) && minimumVal > parseInt(value.trim())) {
						item.find('input').addClass('is-invalid')
						item.find('.input-group-append').addClass('is-invalid')
						item.find('label').addClass('text-danger')
						// console.log(5.1)
						return false
					} else {
						item.find('input').removeClass('is-invalid')
						item.find('.input-group-append').removeClass('is-invalid')
						item.find('label').removeClass('text-danger')
					}
				} else if (validation.startsWith('max-')) {
					var maximumVal = parseInt(validation.replace('max-',''))
					if (!Number.isNaN(maximumVal) && !Number.isNaN(parseInt(value.trim())) && maximumVal < parseInt(value.trim())) {
						item.find('input').addClass('is-invalid')
						item.find('.input-group-append').addClass('is-invalid')
						item.find('label').addClass('text-danger')
						// console.log(5.2)
						return false
					} else {
						item.find('input').removeClass('is-invalid')
						item.find('.input-group-append').removeClass('is-invalid')
						item.find('label').removeClass('text-danger')
					}
				}
			}
			value = value && value.trim()
			if (!value.length || !Number.isNaN(parseInt(value))) {
				if (item.data('type').includes(',')) {
					// console.log(6)
					return false
				}
				item.find('input').removeClass('is-invalid')
				item.find('.input-group-append').removeClass('is-invalid')
				item.find('label').removeClass('text-danger')
				return true
			} else {
				if (!item.data('type').includes(',')) {
					item.find('input').addClass('is-invalid')
					item.find('.input-group-append').addClass('is-invalid')
					item.find('label').addClass('text-danger')
				}
				// console.log(7)
				return false
			}
		} else if (itemType == 'number') {
			var value = item.find('input').val()
			var validations = item.data('validation') ? item.data('validation').split(',') : []
			for (var i = validations.length - 1; i >= 0; i--) {
				var validation = validations[i]
				if (validation == 'required') {
					if (!value || !value.trim().length || Number.isNaN(parseFloat(value.trim()))) {
						item.find('input').addClass('is-invalid')
						item.find('.input-group-append').addClass('is-invalid')
						item.find('label').addClass('text-danger')
						// console.log(8)
						return false
					} else {
						item.find('input').removeClass('is-invalid')
						item.find('.input-group-append').removeClass('is-invalid')
						item.find('label').removeClass('text-danger')
					}
				}
			}
			value = value && value.trim()
			if (!value.length || !Number.isNaN(parseFloat(value))) {
				if (item.data('type').includes(',')) {
					// console.log(9)
					return false
				}
				item.find('input').removeClass('is-invalid')
				item.find('.input-group-append').removeClass('is-invalid')
				item.find('label').removeClass('text-danger')
				return true
			} else {
				if (!item.data('type').includes(',')) {
					item.find('input').addClass('is-invalid')
					item.find('.input-group-append').addClass('is-invalid')
					item.find('label').addClass('text-danger')
				}
				// console.log(10)
				return false
			}
		} else if (itemType == 'enum') {
			var value = item.find('select').val()
			var validations = item.data('validation') ? item.data('validation').split(',') : []
			for (var j = validations.length - 1; j >= 0; j--) {
				var validation = validations[j]
				if (validation == 'required') {
					if (!value || !value.trim().length) {
						item.find('input').addClass('is-invalid')
						item.find('.select2').addClass('is-invalid')
						item.find('.input-group-append').addClass('is-invalid')
						item.find('label').addClass('text-danger')
						item.find('span').addClass('text-danger')
						// console.log(11)
						return false
					} else {
						item.find('input').removeClass('is-invalid')
						item.find('.select2').removeClass('is-invalid')
						item.find('.input-group-append').removeClass('is-invalid')
						item.find('label').removeClass('text-danger')
						item.find('span').removeClass('text-danger')
					}
				}
			}
			return true
		} else if (itemType == 'array') {
			if (item.data('type-input') == 'text') {
				try {
					var data = JSON.parse(item.find('input').val())
					if (Array.isArray(data)) {
						return true
					}
				} catch (e) {}
				// console.log(12)
				return false
			}
			if (isSave) {
				var dataSource = item.data('save-source')
				if (dataSource && dataSource == 'pre') {
					return validateJSONData(item.find('#'+item.data('vdc-container-id')),isSave)
				} else if (dataSource && dataSource == 'input') {
					return validateJSONData(item.find('#'+item.data('vdc-container-id')),isSave)
				} else if (dataSource && dataSource == 'form') {

				}
			} else {
				var dataSource = item.data('add-source')
				if (dataSource && dataSource == 'form') {
					if (item.children().length > 0) {
						if ($(item.children()[0]).data('type') == 'json') {
							var isValid = validateJSONData(item.children()[0], isSave)
							var validations = item.data('validation') ? item.data('validation').split(',') : []
							for (var j = validations.length - 1; j >= 0; j--) {
								var validation = validations[j]
								if (validation == 'uniqueItems') {
									var newItem = createJSONData(item.children()[0], isSave);
									var previousItems = createJSONData(item.find('#'+item.data('vdc-container-id')),true)
									// var previousItems = createJSONData(item.find('#'+item.data('vdc-container-id')),$(item).data('reverse-if-child') ? !isSave : isSave)
									while (previousItems && typeof previousItems == 'object' && !Array.isArray(previousItems)) {
										for (k in previousItems) {
											previousItems = previousItems[k]
											break
										}
									}
									previousItems = previousItems || []

									var uniqueParams = item.data('validation-unique-params') ? item.data('validation-unique-params').split(',') : []
									for (var i = previousItems.length - 1; i >= 0; i--) {
										if (uniqueParams && uniqueParams.length) {
											for (var j = uniqueParams.length - 1; j >= 0; j--) {
												var param = uniqueParams[j]
												if (newItem[param] == previousItems[i][param]) {
													isValid = false
													$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('pre.data-type-json').addClass('is-invalid')
													$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('.input-group-append').addClass('is-invalid')
													break
												} else {
													$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('pre.data-type-json').removeClass('is-invalid')
													$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('.input-group-append').removeClass('is-invalid')
												}
											}
										} else {
											if (_u.isEqual(newItem, previousItems[i])) {
												isValid = false
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('pre.data-type-json').addClass('is-invalid')
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('.input-group-append').addClass('is-invalid')
											} else {
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('pre.data-type-json').removeClass('is-invalid')
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('.input-group-append').removeClass('is-invalid')
											}
										}
									}
								}
							}
							// console.log(25,isValid)
							return isValid
						} else if (item.data('original-item-type') == 'string') {
							var isValid = true
							var validations = item.data('validation') ? item.data('validation').split(',') : []
							for (var j = validations.length - 1; j >= 0; j--) {
								var validation = validations[j]
								if (validation.startsWith('uniqueItems')) {
									var newItem = createJSONData(item, isSave)
									var previousItems = createJSONData(item.find('#'+item.data('vdc-container-id')),true)
									if (typeof previousItems == 'object') {
										for (k in previousItems) {
											previousItems = previousItems[k]
											break
										}
									}
									previousItems = previousItems || []

									for (var i = previousItems.length - 1; i >= 0; i--) {
										if (newItem == previousItems[i]) {
											isValid = false
											$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('input.data-type-string').addClass('is-invalid')
											$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('.input-group-append').addClass('is-invalid')
										} else {
											$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('input.data-type-string').removeClass('is-invalid')
											$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('.input-group-append').removeClass('is-invalid')
										}
									}
								}
							}
							// console.log(13,isValid)
							return isValid
						} else {
							while (item.children().length == 1) {
								item = item.children(0)
							}

							var isValid = true
							for (var i = item.children().length - 1; i >= 0; i--) {
								isValid = validateJSONData(item.children()[i], $(item.children()[i]).data('reverse-if-child') ? !isSave : isSave) && isValid
							}
							// console.log(14,isValid)
							return isValid
						}
					} else {
						var validations = item.data('validation') ? item.data('validation').split(',') : []
						for (var j = validations.length - 1; j >= 0; j--) {
							var validation = validations[j]
							if (validation.startsWith('min-')) {
								var minimumItems = parseInt(validation.replace('min-',''))
								if (minimumItems && minimumItems > item.children().length && item.children().length || validations.includes('required') && !item.children().length) {
									item.addClass('is-invalid')
									// console.log(20)
									return false
								} else {
									item.removeClass('is-invalid')
								}
							}
						}
						return true
					}
				}
			}


		} else if (itemType == 'json') {
			if (isSave) {
				var dataSource = item.data('save-source')
				if (dataSource && dataSource == 'pre') {
					if (!validateJSONData(item.find('#'+item.data('vdc-container-id')),isSave)) {
						item.find('label').addClass('is-invalid')
						item.find('.invalid-feedback').addClass('is-invalid')
						// console.log(15)
						return false
					} else {
						item.find('label').removeClass('is-invalid')
						item.find('.invalid-feedback').removeClass('is-invalid')
						return true
					}
					// console.log(16,isValid)
					return isValid
				} if (dataSource && dataSource == 'form') {
					var siblings = item.siblings()
					for (var i = siblings.length - 1; i >= 0; i--) {
						var s = siblings[i]
						if (s && item.data('key') && $(s).data('key') == item.data('key')) {
							return validateJSONData(s, isSave)
						}
					}
					var containerId = '#'+item.data('vdc-container-id')
					var dataSource = item.data('save-source')

					while (item && item.children().length == 1 && !item.data('key')) {
						item = item.children(0)
					}

					if (dataSource && dataSource == 'pre') {
						return validateJSONData(item.find(containerId),isSave)
					}

					var isValid = true
					for (var i = item.children().length - 1; i >= 0; i--) {
						isValid = validateJSONData(item.children()[i], $(item.children()[i]).data('reverse-if-child') ? !isSave : isSave) && isValid
					}
					// console.log(17,isValid)
					return isValid
				}
			} else {
				var dataSource = item.data('add-source')
				if (dataSource && dataSource == 'pre') {
					return validateJSONData(item.find('#'+item.data('vdc-container-id')),isSave)
				} if (dataSource && dataSource == 'form' || dataSource && dataSource == 'input') {
					var innerItem = item
					while (innerItem && innerItem.children().length == 1) {
						innerItem = innerItem.children(0)
					}

					var isValid = true
					for (var i = innerItem.children().length - 1; i >= 0; i--) {
						isValid = validateJSONData(innerItem.children()[i], $(innerItem.children()[i]).data('reverse-if-child') ? !isSave : isSave) && isValid
					}

					var validations = item.data('validation') ? item.data('validation').split(',') : []
					validations.sort()
					for (var k = 0; k < validations.length; k++) {
						var validation = validations[k]
						if (validation == 'uniqueItems') {
							var newItem = createJSONData(item, isSave)
							var previousItems = createJSONData(item.find('#'+item.data('vdc-container-id')),true)
							if (previousItems && typeof previousItems == 'object' && !Array.isArray(previousItems)) {
								previousItems = previousItems[item.data('inner-key')] || previousItems
							}
							if (!(item.data('validation-unique-params') && item.data('validation-unique-params').includes("_id"))) {
								if (!Array.isArray(previousItems)) {
									var tempArray = []
									for (itemKey in previousItems) {
										tempArray.push(previousItems[itemKey])
									}
									previousItems = tempArray
								}
							} else {
								var tempArray = []
								for (itemKey in previousItems) {
									var newObject = {}
									newObject[itemKey] = previousItems[itemKey]
									tempArray.push(newObject)
								}
								previousItems = tempArray
							}

							var uniqueParams = item.data('validation-unique-params') ? item.data('validation-unique-params').split(',') : []

							for (var i = previousItems.length - 1; i >= 0; i--) {
								if (uniqueParams && uniqueParams.length) {
									for (var j = uniqueParams.length - 1; j >= 0; j--) {
										var param = uniqueParams[j]
										if (param == "_id") {
											if (Object.keys(newItem)[0] == Object.keys(previousItems[i])[0]) {
												isValid = false
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('pre.data-type-json').addClass('is-invalid')
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('.input-group-append').addClass('is-invalid');
												break
											} else {
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('pre.data-type-json').removeClass('is-invalid')
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('.input-group-append').removeClass('is-invalid')
											}
										} else if (uniqueParams.includes('_id')) {
											if (newItem[Object.keys(newItem)[0]][param] && previousItems[i][Object.keys(previousItems[i])[0]][param] && newItem[Object.keys(newItem)[0]][param] == previousItems[i][Object.keys(previousItems[i])[0]][param]) {
												isValid = false
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('pre.data-type-json').addClass('is-invalid')
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('.input-group-append').addClass('is-invalid')
												break
											} else {
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('pre.data-type-json').removeClass('is-invalid')
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('.input-group-append').removeClass('is-invalid')
											}
										} else {
											if (newItem[param] && previousItems[i][param] && newItem[param] == previousItems[i][param]) {
												isValid = false
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('pre.data-type-json').addClass('is-invalid')
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('.input-group-append').addClass('is-invalid')
												break
											} else {
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('pre.data-type-json').removeClass('is-invalid')
												$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('.input-group-append').removeClass('is-invalid')
											}
										}
									}
								} else {
									if (_u.isEqual(newItem, previousItems[i])) {
										isValid = false
										$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('pre.data-type-json').addClass('is-invalid')
										$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('.input-group-append').addClass('is-invalid')
									} else {
										$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('pre.data-type-json').removeClass('is-invalid')
										$(item.find('#'+item.data('vdc-container-id')).children()[i]).find('.input-group-append').removeClass('is-invalid')
									}
								}
							}
						} else if (validation == 'uniqueItemsGlobal') {
							var newItem = createJSONData(innerItem, isSave)
							var previousGlobalItems = createJSONData($('#'+item.data('vdc-container-global-id')),true)
							var uniqueParams = item.data('validation-unique-global-params') ? item.data('validation-unique-global-params').split(',') : []
							var outerIndex = -1
							for (outerKey in previousGlobalItems) {
								outerIndex++
								var previousItems = item.data('inner-key') && previousGlobalItems[outerKey][item.data('inner-key')] ? previousGlobalItems[outerKey][item.data('inner-key')] : previousGlobalItems[outerKey]
								if (!Array.isArray(previousItems)) {
									var tempArray = []
									for (itemKey in previousItems) {
										tempArray.push(previousItems[itemKey])
									}
									previousItems = tempArray
								}
								for (var i = previousItems.length - 1; i >= 0; i--) {
									if (uniqueParams && uniqueParams.length) {
										for (var j = uniqueParams.length - 1; j >= 0; j--) {
											var param = uniqueParams[j]
											if (newItem[param] && previousItems[i][param] && newItem[param] == previousItems[i][param]) {
												isValid = false
												$($('#'+item.data('vdc-container-global-id')).children()[outerIndex]).find('pre.data-type-json').addClass('is-invalid')
												$($('#'+item.data('vdc-container-global-id')).children()[outerIndex]).find('.input-group-append').addClass('is-invalid');
												break
											} else {
												$($('#'+item.data('vdc-container-global-id')).children()[outerIndex]).find('pre.data-type-json').removeClass('is-invalid')
												$($('#'+item.data('vdc-container-global-id')).children()[outerIndex]).find('.input-group-append').removeClass('is-invalid')
											}
										}
									} else {
										if (_u.isEqual(newItem, previousItems[i])) {
											isValid = false
											$($('#'+item.data('vdc-container-global-id')).children()[outerIndex]).find('pre.data-type-json').addClass('is-invalid')
											$($('#'+item.data('vdc-container-global-id')).children()[outerIndex]).find('.input-group-append').addClass('is-invalid')
										} else {
											$($('#'+item.data('vdc-container-global-id')).children()[outerIndex]).find('pre.data-type-json').removeClass('is-invalid')
											$($('#'+item.data('vdc-container-global-id')).children()[outerIndex]).find('.input-group-append').removeClass('is-invalid')
										}
									}
								}
							}
						}
					}


					// console.log(18,isValid)
					return isValid
				}
			}
		} else if (itemType == 'pre') {
			if (isSave) {
				var pre = item.find('pre').length ? item.find('pre') : item
				var value
				try {value = JSON.parse(pre.html())} catch (e) {}
				var validations = item.data('validation') ? item.data('validation').split(',') : []
				for (var j = validations.length - 1; j >= 0; j--) {
					var validation = validations[j]
					if (validation == 'requiredIfVisible' && $(item).is(':visible')) {
						validation = 'required'
					}
					var isRequired = validations.includes('required') || validations.includes('requiredIfVisible') && $(item).is(':visible')
					if (validation.startsWith('min-')) {
						var minimumItems = parseInt(validation.replace('min-',''))
						if (minimumItems && minimumItems > item.children().length && item.children().length || isRequired && !item.children().length) {
							item.addClass('is-invalid')
							$('#' + item.data('section-id') + '>.form-item-container').addClass('is-invalid')
							// console.log(20)
							return false
						} else {
							item.removeClass('is-invalid')
						}
					} else if (validation == 'required') {
						if (!value) {
							item.find('input').addClass('is-invalid')
							item.find('.input-group-append').addClass('is-invalid')
							item.find('label').addClass('text-danger')
							// console.log(19)
							return false
						} else {
							item.find('input').removeClass('is-invalid')
							item.find('.input-group-append').removeClass('is-invalid')
							item.find('label').removeClass('text-danger')
						}
					} else if (validation == 'shouldRequired') {
						if (!value && !confirm('Are you sure you want to leave Parameters empty')) {
							// console.log(19.1)
							return false
						}
					} else if (validation == 'validContent') {
						return validateContent(value)
					}
				}
				return true
			} else {
				return true
			}
		} else if (itemType == 'input') {
			if (isSave) {
				var validations = item.data('validation') ? item.data('validation').split(',') : []
				for (var j = validations.length - 1; j >= 0; j--) {
					var validation = validations[j]
					if (validation.startsWith('min-')) {
						var minimumItems = parseInt(validation.replace('min-',''))
						if (minimumItems && minimumItems > item.children().length) {
							item.parent().find('input').addClass('is-invalid')
							item.parent().find('.input-group-append').addClass('is-invalid')
							item.parent().find('label').addClass('text-danger')
							// console.log(21)
							return false
						} else {
							item.parent().find('input').removeClass('is-invalid')
							item.parent().find('.input-group-append').removeClass('is-invalid')
							item.parent().find('label').removeClass('text-danger')
						}
					}
				}
				return true
			} else {
				return true
			}
		} else if (itemType == 'inside') {
			if (isSave) {
				var dataSource = item.data('save-source')
				if (dataSource && dataSource == 'form') {

					var isValid = true
					for (var i = item.children().length - 1; i >= 0; i--) {
						isValid = validateJSONData(item.children()[i], $(item.children()[i]).data('reverse-if-child') ? !isSave : isSave) && isValid
					}
					// console.log(22,isValid)
					return isValid
				}
			}
		} else if (itemType == 'form') {
			if (item.data('original-type') == 'array') {
				var isValid = true
				for (var i = item.children().length - 1; i >= 0; i--) {
					isValid = validateJSONData(item.children()[i], $(item.children()[i]).data('reverse-if-child') ? !isSave : isSave) && isValid
				}
				// console.log(122,isValid)
				return isValid
			}
		} else if (item.data('type') == 'json-from-template') {
			var isValid = true
			var properties = $(item).find('.' + $(item).data('vdc-container-class')).children()
			for(var j = 0; j < properties.length; j++) {
				try {
					//TODO - check if working
					var propertiesJSON = JSON.parse($(properties[j]).data('item-json').split('\'').join('"'))
					if (propertiesJSON) {
						if (propertiesJSON.input == 'enum') {
							var value = $(properties[j]).find('select').val()
							if (!value && propertiesJSON.allowCustom) {
								value = $(properties[j]).find('input[type="text"]').val()
							}

							if (propertiesJSON.unit == 'percentage' || propertiesJSON.unit == 'MB/s' || propertiesJSON.unit == 'none' || propertiesJSON.unit == 'seconds' || propertiesJSON.unit == 'tuple' || propertiesJSON.unit == 'number') {
								value = value == '' ? 'NaN' : value
								value = +value.split(',').join('.')
								if (propertiesJSON.unit == 'percentage' || propertiesJSON.unit == 'MB/s' || propertiesJSON.unit == 'none') {
									if (Number.isNaN(value) || value < 0) {
										$(properties[j]).find('input').addClass('is-invalid')
										$(properties[j]).find('.input-group-append').addClass('is-invalid')
										$(properties[j]).find('label').addClass('text-danger')
										isValid = false
									}
								} else if (propertiesJSON.unit == 'seconds' || propertiesJSON.unit == 'tuple' || propertiesJSON.unit == 'number') {
									if (Number.isNaN(value) || value < 0 || !Number.isInteger(value)) {
										$(properties[j]).find('.input-group-append').addClass('is-invalid')
										$(properties[j]).find('label').addClass('text-danger')
										$(properties[j]).find('input').addClass('is-invalid')
										isValid = false
									}
								}
							}
						}
					}
				} catch (e) {console.log(e)}
			}


			return isValid
		}
		// console.log(23)
		return false
	}

	function createJSONData(item, isSave, itemType) {
		item = $(item)
		if (!item) {
			return null
		}

		if (typeof isSave == 'string') {
			itemType = isSave
			isSave = false
		}

		if (!item.data('type')) {
			var children = $(item).children()
			var data = {}
			for (var i = children.length - 1; i >= 0; i--) {
				var newItem = createJSONData(children[i], isSave)
				Object.assign(data,newItem)
			}
			return data
		}

		itemType = itemType || item.data('type')

		if (!itemType) {
			return null
		}

		var key = item.data('key')
		if (item.data('key-origin-id')) {
			key = $('#' + item.data('key-origin-id')).find('input').val() || $('#' + item.data('key-origin-id')).data('default-value')|| 'item'
			// key = key.toLowerCase().replace(' ', '_')
		}


		if (itemType.includes(',')) {
			var types = itemType ? itemType.split(',') : []
			for (var i = types.length - 1; i >= 0; i--) {
				if (validateJSONData(item, isSave, types[i])) {
					return createJSONData(item, isSave, types[i])
				}
			}
			return null
		}
		// console.log('createJSONData',item, isSave, itemType, item.data('validation'),key)
		if (itemType == 'any') {
			if (isSave) {
				var dataSource = item.data('save-source')
				if (dataSource && dataSource == 'pre') {
					while (item && item.children().length == 1) {
						item = item.children(0)
					}
					for (var i = item.children().length - 1; i >= 0; i--) {
						var child = item.children()[i]
						if ($(child).data('type') == 'pre') {
							var data = createJSONData(child, isSave)
							return createReturnObject(data, key,item)
						}
					}
				}
			}
		} else if (itemType == 'string') {
			var data = item.find('input').val() || item.find('select').val() || item.find('textarea').val() || item.data('default-value')
			return createReturnObject(data, key, item)
		} else if (itemType == 'checkboxString') {
			var data = item.find('input:checked').length ? item.find('input:checked').val() : undefined
			return createReturnObject(data, key, item)
		} else if (itemType == 'bool') {
			if (item.data('type-input') && item.data('type-input').toLowerCase() === 'text') {
				var value = item.find('input').val()
				var data = value && value.toLowerCase() === 'true' ? true : false
				return createReturnObject(data, key,item)
			} else {
				var data = item.find('input:checked').length == 1 ? true : false
				return createReturnObject(data, key,item)
			}

		} else if (itemType == 'int') {
			var data = item.find('input').val()
			data = data && data.trim() && parseInt(data.trim())

			if (typeof data == 'number' && !Number.isNaN(data)) {
				return createReturnObject(data, key,item)
			}
			return null
		} else if (itemType == 'number') {
			var data = item.find('input').val()
			data = data && data.trim() && parseFloat(data.trim())

			if (typeof data == 'number' && !Number.isNaN(data)) {
				return createReturnObject(data, key,item)
			}
			return null
		} else if (itemType == 'enum') {
			var data = item.find('select').val()
			data = data || undefined
			return createReturnObject(data, key,item)
		} else if (itemType == 'json') {
			var mainItem = item
			if (isSave) {
				var dataSource = item.data('save-source')
				if (dataSource && dataSource == 'pre') {
					while (item && item.children().length == 1) {
						item = item.children(0)
					}
					for (var i = item.children().length - 1; i >= 0; i--) {
						var child = item.children()[i]
						if ($(child).data('type') == 'pre') {
							data = createJSONData(child, isSave)
							if (mainItem.data('ignore-if-empty') && !Object.keys(data).length) {
								return null
							}
							return createReturnObject(data, key,item)
						}
					}
				} else if (dataSource && dataSource == 'form') {

					while (item && item.children().length == 1 && !item.data('key')) {
						item = item.children(0)
					}

					var data = {}
					for (var i = item.children().length - 1; i >= 0; i--) {
						var newItem = createJSONData(item.children()[i],isSave)
						if (newItem && typeof newItem == 'object') {
							Object.assign(data,newItem)
						}
					}
					if (mainItem.data('ignore-if-empty') && !Object.keys(data).length) {
						return null
					}
					return createReturnObject(data, key, true,item)
				}
			} else {
				var dataSource = item.data('add-source')
				if (dataSource && dataSource == 'pre') {
					var data = {}
					if (item.find('pre.data-type-json').length) {
						try {data = JSON.parse(item.find('pre.data-type-json').html())} catch (e) {}
					}

					if (mainItem.data('ignore-if-empty') && !Object.keys(data).length) {
						return null
					}

					return createReturnObject(data, key, true,item)
				} else if (dataSource && dataSource == 'form') {
					while (item && item.children().length == 1 && !item.children(0).data('type')) {
						item = item.children(0)
					}
					var data = {}
					for (var i = item.children().length - 1; i >= 0; i--) {
						var newItem = createJSONData(item.children()[i], $(item.children()[i]).data('reverse-if-child') ? !isSave : isSave)
						if (newItem && typeof newItem == 'object') {
							Object.assign(data,newItem)
						} else if (!key && newItem && typeof newItem == 'string') {
							// key = newItem
						}
					}
					return createReturnObject(data, key, true,item)
				}
			}
			return null
		} else if (itemType == 'array') {
			if (item.data('type-input') == 'text') {
				var data
				try {
					data = JSON.parse(item.find('input').val())
				} catch (e) {}
				return createReturnObject(data, key,item)
			}
			if (isSave) {

				var containerId = '#'+item.data('vdc-container-id')
				while (item.children().length == 1) {
					item = item.children(0)
				}

				var container = item.find(containerId)

				if (container) {
					return createJSONData(container,isSave)
				}
			 } else {
				for (var i = item.children().length - 1; i >= 0; i--) {
					var data = createJSONData(item.children()[i], isSave)
					if (data) {
						return data
					}
				}
			}
		} else if (itemType == 'pre') {
			if (isSave) {
				if (item.data('original-type') == 'json') {
					var randomKey = item.data('random-key')
					var data = {}
					for (var i = 0; i < item.children().length; i++) {
						try {
							var child = $(item.children()[i]).is('pre') ? $(item.children()[i]) : $(item.children()[i]).find('pre')
							var value = JSON.parse(child.html())
							if (value) {
								if (randomKey) {
									var r = {}
									r[randomKey + (i+1)] = value
									Object.assign(data, r)
								} else {
									Object.assign(data, value)
								}
							}
						} catch (e) {}

					}
					return createReturnObject(data, key,item)
				} else if (item.data('original-type') == 'array') {
					var data = []
					for (var i = 0; i < item.children().length; i++) {
						try {
							var value = JSON.parse($(item.children()[i]).find('pre').html())
							if (value && !Array.isArray(value)) {
								data.push(value)
							} else if (value) {
								data = value
							}
						} catch (e) {
							var validations = item.data('validation') ? item.data('validation').split(',') : []
							if (validations.includes('shouldRequired')) {
								data = []
							}
						}

					}

					if (!data.length) {
						var validations = item.data('validation') ? item.data('validation').split(',') : []
						if (!validations.includes('required') && !validations.includes('required-save') && !validations.includes('shouldRequired') || item.data('ignore-if-empty')) {
							return null
						}
					}

					return createReturnObject(data, key,item)

				} else if (item.data('original-type') == 'any') {

					var data = item.find('pre').html().replace('<xmp>','').replace('</xmp>','')

					try {
						data = JSON.parse(data)
					} catch (e) {}

					return createReturnObject(data, key,item)

				}
			} else {
				if (item.data('original-type') == 'json') {

				} else if (item.data('original-type') == 'array') {

				}
			}
		} else if (itemType == 'input') {

			if (isSave) {
				if (item.parent().data('type') == 'array') {
					var data = []
					for (var i = item.children().length - 1; i >= 0; i--) {
						var value = createJSONData(item.children()[i], isSave)
						if (value) {
							data.push(value)
						}
					}
					if (!data.length) {
						var validations = item.data('validation') ? item.data('validation').split(',') : []
						if (!validations.includes('required')) {
							return null
						}
					}

					return createReturnObject(data, key, true, item)
				}
			} else {
				return null
			}
		} else if (itemType == 'inside') {
			if (isSave) {
				var dataSource = item.data('save-source')
				if (dataSource && dataSource == 'form') {

					var data = {}
					for (var i = item.children().length - 1; i >= 0; i--) {
						var newItem = createJSONData(item.children()[i],isSave)
						if (newItem) {
							Object.assign(data,newItem)
						}
					}
					return createReturnObject(data, key, true,item)
				}
			}
			return null
		} else if (itemType == 'form') {
			if (item.data('original-type') == 'array') {
				var data = []
				for (var i = 0; i < item.children().length; i++) {
					var newItem = createJSONData(item.children()[i],isSave)
					if (newItem) {
						data.push(newItem)
					}
				}

				return createReturnObject(data, key, item)

			}
		} else if (itemType == 'json-from-template') {
			var properties = $(item).find('.' + $(item).data('vdc-container-class')).children()
			//TODO
			var templeteJSON = JSON.parse($(item).data('item-json').split('\'').join('"'))
			var idValue
			var returnObject = {
				'properties' : {}
			}

			for(var j = 0; j < properties.length; j++) {
				try {
					//TODO
					var propertiesJSON = JSON.parse($(properties[j]).data('item-json').split('\'').join('"'))
					if (propertiesJSON) {
						if (propertiesJSON.input == 'enum') {
							var value = $(properties[j]).find('select').val()
							if (!value && propertiesJSON.allowCustom) {
								value = $(properties[j]).find('input[type="text"]').val()
							}
							if (propertiesJSON.unit == 'percentage' || propertiesJSON.unit == 'MB/s' || propertiesJSON.unit == 'none' || propertiesJSON.unit == 'seconds' || propertiesJSON.unit == 'tuple' || propertiesJSON.unit == 'number') {
								value = +value.split(',').join('.')
							}
							idValue = value
						} else if (propertiesJSON.input == 'check') {
							var value = []
							$.each($('input[name="' + propertiesJSON.id + '"]:checked'), function(){
								value.push($(this).val())
							})
							idValue = value.length && value[0] || idValue
						} else if (propertiesJSON.input == 'bool') {
							var value = $(properties[j]).find('select').val() == 'true' ? 'true' : 'false'
						} else if (propertiesJSON.input == 'text' && propertiesJSON.unit == 'list') {
							var value = $(properties[j]).find('input').val().split(',')
							value = value.map(x => x.trim())
							idValue = value.length && value[0] || idValue
						}
						var innerObject = {}
						innerObject[propertiesJSON.id] = {}
						innerObject[propertiesJSON.id][propertiesJSON.type] = value
						if (propertiesJSON.unit) {
							innerObject[propertiesJSON.id]['unit'] = propertiesJSON.unit
						}
						Object.assign(returnObject.properties, innerObject)
					}
				} catch (e) {console.log(e)}
			}
			returnObject['type'] = templeteJSON.type
			returnObject['description'] = templeteJSON.description + ' ' + idValue
			returnObject['id'] = templeteJSON.id + '_' + idValue
			returnObject['id'] = returnObject['id'].split(' ').join('_')

			return createReturnObject(returnObject, '', true, item)
		}

		return null
	}

	function createReturnObject(data,key,reverse,item) {

		if (typeof reverse == 'object') {
			item = reverse
			reverse = false
		} else if (typeof reverse != 'boolean') {
			item = null
			reverse = false
		}

		// console.log('createReturnObject',item,data,key,reverse)

		if ($(item).data('return-if-visible')) {
			if (!$(item).is(':visible')) {
				return null
			}
		}

		if (reverse && typeof data == 'object' && !Array.isArray(data)) {
			var reverseValue = {}
			Object.keys(data)
				.reverse()
				.forEach(key => {
					reverseValue[key] = data[key]
				})
			data = reverseValue
		} else if (reverse && typeof data == 'object' && Array.isArray(data)) {
			var reverseValue = []
			for (var i = data.length - 1; i >= 0; i--) {
				reverseValue.push(data[i])
			}
			data = reverseValue
		}

		var result = {}

		if (key) {
			result[key] = data
		} else {
			result = data
		}

		var containerKey = item && $(item).data('container-key')
		if (containerKey) {
			var temp = {}
			temp[containerKey] = result
			return JSON.parse(JSON.stringify(temp))
		}

		if (!result) {
			return result
		}

		return JSON.parse(JSON.stringify(result))
	}

	function addButtonListener(event) {

		var button = $(event.currentTarget)
		var sectionId  = button.data('section-id')
		var vdcContainerId = button.data('vdc-container-id')
		var containerDiv = $('#' + sectionId)
		var result = {}

		var type = containerDiv.data('type')
		$(containerDiv).find('.is-invalid').removeClass('is-invalid')
		$(containerDiv).find('.text-danger').removeClass('text-danger')
		if (validateJSONData(containerDiv)) {
			result = createJSONData(containerDiv)
		} else {
			refreshMasonry()
			return
		}

		while (containerDiv && containerDiv.children().length == 1) {
			containerDiv = containerDiv.children(0)
		}

		if (result && (typeof result == 'object' && Object.keys(result).length !== 0 || typeof result != 'object')) {
			var vdcContainer = containerDiv.find('#' + vdcContainerId)

			if (vdcContainer.data('type') == 'pre') {
				var vdcContainerCount = vdcContainer.children().length
				var inputGroup = $('<div class="input-group m-t-10"></div>')
				inputGroup.attr('id', sectionId +'-vdc-array-item-' + (vdcContainerCount + 1))
				inputGroup.data('type', vdcContainer.data('original-item-type') || type)
				inputGroup.data('save-source', vdcContainer.data('save-source'))
				inputGroup.data('add-source', vdcContainer.data('add-source'))

				var pre = $('<pre class="form-control"></pre>')
				pre.attr('aria-describedby', sectionId +'-vdc-array-item-minus-btn-' + (vdcContainerCount + 1))
				if (typeof result == 'object') {
					pre.html(JSON.stringify(result, undefined, 4))
				} else {
					pre.html(result)
				}
				pre.data('section-id', sectionId)
				pre.addClass('data-type-' + vdcContainer.data('original-item-type'))

				var invalidDiv = $('<div class="invalid-feedback">' + (vdcContainer.data('invalid-text') || 'Item must be unique') + '</div>')

				var inputAppend = $('<div class="input-group-append"></div>')
				var inputButton = $('<button type="button" class="btn btn-outline btn-outline-danger"><i class="mdi mdi-minus"></i></button>')
				inputButton.attr('id', sectionId +'-vdc-array-item-minus-btn--' + (vdcContainerCount + 1))
				inputButton.data('section-id', sectionId +'-vdc-array-item-' + (vdcContainerCount + 1))
				inputButton.click(removeItemFromArray)
				inputAppend.append(inputButton)

				inputGroup.append(pre)
				inputGroup.append(inputAppend)
				inputGroup.append(invalidDiv)

				vdcContainer.append(inputGroup)
				for (var i = containerDiv.children().length - 1; i >= 0; i--) {

					var item = $(containerDiv.children()[i])
					item.find('input').removeClass('is-invalid')
					item.find('.input-group-append').removeClass('is-invalid')
					item.find('label').removeClass('text-danger')
					if (item.data('type') == 'string') {
						item.find('input[type=text]').val('')
						item.find('input[type=checkbox]').prop('checked', false)
						item.find('textarea').val('')
						item.find('select').val('')
						item.find('select').trigger('change')
					} else if (item.data('type') == 'int') {
						item.find('input[type=text]').val('')
					} else if (item.data('type') == 'enum') {
						item.find('select').val('')
						item.find('select').trigger('change')
					} else if (item.data('type') == 'json') {
						item.find('pre').addClass('hide')
						item.find('pre').html('')
						item.find('.pre-container').empty()
						item.find('input[type=text]').val('')
						item.find('textarea').val('')
						item.find('input[type=checkbox]').prop('checked', false)
						item.find('select').val('')
						item.find('select').trigger('change')
						item.find('.btn-edit').addClass('hide')
						item.find('.btn-delete').addClass('hide')
						item.find('.btn-add').removeClass('hide')
					} else if (item.data('type') == 'array') {
						item.find('.vdc-array-container').empty()
					} else if (item.data('type') == 'bool') {
						item.find('input:checked').prop('checked', false)
					}
					if (item.attr('id') == 'vdc-data-managment-attributes') {
						item.find('.vdc-array-container').empty()
						setupSelectWithData('vdc-data-managment-attributes-data-utility')
						setupSelectWithData('vdc-data-managment-attributes-security')
						setupSelectWithData('vdc-data-managment-attributes-privacy')
					}

				}
			} else if (vdcContainer.data('type') == 'input') {
				var text = ''
				if (typeof result == 'object') {
					for (var key in result) {
						text = result[key]
					}
				} else {
					text = result
				}

				if (!text) {
					return
				}

				var vdcContainerCount = vdcContainer.children().length
				var inputGroup = $('<div class="input-group m-t-10"></div>')
				inputGroup.attr('id', sectionId +'-vdc-array-item-' + (vdcContainerCount + 1))
				inputGroup.data('type', vdcContainer.data('original-type'))
				inputGroup.data('section-id', sectionId)
				inputGroup.data('save-source', vdcContainer.data('save-source'))
				inputGroup.data('add-source', vdcContainer.data('add-source'))

				var input = $('<input type="text" class="form-control" placeholder=""disabled>')
				input.attr('aria-describedby', sectionId +'-vdc-array-item-minus-btn-' + (vdcContainerCount + 1))
				input.val(text)
				input.data('section-id', sectionId)
				input.addClass('data-type-' + vdcContainer.data('original-item-type'))

				var invalidDiv = $('<div class="invalid-feedback">' + (vdcContainer.data('invalid-text') || 'Item must be unique') + '</div>')

				var inputAppend = $('<div class="input-group-append"></div>')
				var inputButton = $('<button type="button" class="btn btn-outline btn-outline-danger"><i class="mdi mdi-minus"></i></button>')
				inputButton.attr('id', sectionId +'-vdc-array-item-minus-btn-' + (vdcContainerCount + 1))
				inputButton.data('section-id', sectionId +'-vdc-array-item-' + (vdcContainerCount + 1))
				inputButton.click(removeItemFromArray)
				inputAppend.append(inputButton)

				inputGroup.append(input)
				inputGroup.append(inputAppend)
				inputGroup.append(invalidDiv)

				vdcContainer.append(inputGroup)

				for (var i = containerDiv.children().length - 1; i >= 0; i--) {
					var item = $(containerDiv.children()[i])
					item.find('input').removeClass('is-invalid')
					item.find('.input-group-append').removeClass('is-invalid')
					item.find('label').removeClass('text-danger')

					if (item.data('type') == 'string') {
						item.find('input[type=text]').val('')
						item.find('textarea').val('')
						item.find('select').val('')
						item.find('select').trigger('change')
					} else if (item.data('type') == 'int') {
						item.find('input[type=text]').val('')
					} else if (item.data('type') == 'enum') {
						item.find('select').val('')
						item.find('select').trigger('change')
					} else if (item.data('type') == 'json') {
						item.find('pre').addClass('hide')
						item.find('pre').html('')
						item.find('.pre-container').empty()
						item.find('.btn-edit').addClass('hide')
						item.find('.btn-delete').addClass('hide')
						item.find('.btn-add').removeClass('hide')
					}  else if (item.data('type') == 'array') {
						item.find('.vdc-array-container').empty()
					}

				}
			}

			if (button.data('hide-id')) {
				$('#' + button.data('hide-id')).addClass('hide')
			}
			if (button.data('show-id')) {
				$('#' + button.data('show-id')).removeClass('hide')
			}
			refreshMasonry()
		}
	}

	$('.vdc-array .btn-add, .vdc-object .btn-add').unbind('click')
	$('.vdc-array .btn-add, .vdc-object .btn-add').click(addButtonListener)

	$('.vdc-object .btn-save, .vdc-array .btn-save').click(function(event) {
		var button = $(event.currentTarget)
		var sectionId  = button.data('section-id')
		var containerDiv = $('#' + sectionId)
		var result = {}

		containerDiv.removeClass('saved-card')

		$(containerDiv).find('.is-invalid').removeClass('is-invalid')
		$(containerDiv).find('.text-danger').removeClass('text-danger')

		if (validateJSONData(containerDiv,true)) {
			result = createJSONData(containerDiv,true)
			console.log(result)
		}
		refreshMasonry()

		if (sectionId == 'vdc-data-sources') {
			if (result && result['Data_Sources'].length) {
				containerDiv.addClass('saved-card')
				configureDataSourcesSelect(result)
				extendBlueprint(result)
				console.log(VDCBlueprint)
			}
		} else if (sectionId == 'vdc-exposed-api') {
			if (result && Object.keys(result).length) {
				var methodKey = $('#vdc-exposed-api-method select').val()
				var response200 = result['200']
				var response201 = result['201']

				delete result['200']
				delete result['201']

				if (response200) {
					VDCBlueprint['EXPOSED_API'].paths[methodKey][Object.keys(VDCBlueprint['EXPOSED_API'].paths[methodKey])[0]]['responses']['200']['content'] = response200
				}

				if (response201) {
					VDCBlueprint['EXPOSED_API'].paths[methodKey][Object.keys(VDCBlueprint['EXPOSED_API'].paths[methodKey])[0]]['responses']['201']['content'] = response201
				}

				Object.assign(VDCBlueprint['EXPOSED_API'].paths[methodKey][Object.keys(VDCBlueprint['EXPOSED_API'].paths[methodKey])[0]], result)

				$('#vdc-exposed-api-x-iam-roles').find('input').val('')
				$('#vdc-exposed-api-x-iam-roles').find('.vdc-array-container').empty()

				$('#vdc-exposed-api-method select').val('')
				$('#vdc-exposed-api-method select').trigger('change')

				configureMethodIds()
				validateExposedAPI()

				refreshMasonry()
				// console.log(VDCBlueprint)
			}
		} else if (result && Object.keys(result).length) {
			containerDiv.addClass('saved-card')
			extendBlueprint(result)
			// console.log(VDCBlueprint)
		}

	})

	function configureDataSourcesSelect(data){
		data = data && (data['Data_Sources'] || data['INTERNAL_STRUCTURE']['Data_Sources'])
		if (data) {
			$('select.datasource-select').prop('disabled', false)
			$('select.datasource-select').empty()
			var o = new Option('Select', '')
			$(o).html('Select')
			$('select.datasource-select').append(o)
			for(var i = 0; i < data.length; i++) {
				var o = new Option(data[i].id, data[i].id)
				$(o).html(data[i].id)
				$('select.datasource-select').append(o)
			}
		}
	}

	function configureMethodIds() {
		$('select.method-select').empty()
		$('select.method-select').prop('disabled', false)
		var o = new Option('Select', '')
		$(o).html('Select')
		$('select.method-select').append(o)

		var methods = Object.keys(VDCBlueprint['EXPOSED_API'].paths)
		for(var i = 0; i < methods.length; i++) {
			var operationId = VDCBlueprint['EXPOSED_API'].paths[methods[i]][Object.keys(VDCBlueprint['EXPOSED_API'].paths[methods[i]])[0]]['operationId']
			if (operationId) {
				var o = new Option(operationId, operationId)
				$(o).html(operationId)
				$('select.method-select').append(o)
			}
		}
	}

	function extendBlueprint(data) {
		if (data['Overview']) {
			VDCBlueprint['INTERNAL_STRUCTURE']['Overview'] = data['Overview']
		} else if (data['Data_Sources']) {
			VDCBlueprint['INTERNAL_STRUCTURE']['Data_Sources'] = data['Data_Sources']
		} else if (data['Methods_Input']) {
			VDCBlueprint['INTERNAL_STRUCTURE']['Methods_Input'] = data['Methods_Input']
		} else if (data['Flow']) {
			VDCBlueprint['INTERNAL_STRUCTURE']['Flow'] = data['Flow']
		} else if (data['Testing_Output_Data']) {
			VDCBlueprint['INTERNAL_STRUCTURE']['Testing_Output_Data'] = data['Testing_Output_Data']
		} else if (data['Identity_Access_Management']) {
			VDCBlueprint['INTERNAL_STRUCTURE']['Identity_Access_Management'] = data['Identity_Access_Management']
		} else if (data['DAL_Images']) {
			VDCBlueprint['INTERNAL_STRUCTURE']['DAL_Images'] = data['DAL_Images']
		} else if (data['VDC_Images']) {
			VDCBlueprint['INTERNAL_STRUCTURE']['VDC_Images'] = data['VDC_Images']
		} else if (data['DATA_MANAGEMENT']) {
			VDCBlueprint['DATA_MANAGEMENT'] = data['DATA_MANAGEMENT']
		} else if (data['COOKBOOK_APPENDIX']) {
			VDCBlueprint['COOKBOOK_APPENDIX'] = data['COOKBOOK_APPENDIX']
		}

		if (VDCBlueprint['INTERNAL_STRUCTURE']['Overview'] && VDCBlueprint['INTERNAL_STRUCTURE']['Data_Sources'] && VDCBlueprint['INTERNAL_STRUCTURE']['Data_Sources'].length) {
			$('#vdc-internal-structure-menu i').addClass('hide')
		}
		if (VDCBlueprint['DATA_MANAGEMENT']) {
			$('#vdc-data-managment-menu i').addClass('hide')
		}
		if (VDCBlueprint['COOKBOOK_APPENDIX']['Resources']) {
			$('#vdc-cookbook-appendix-menu i').addClass('hide')
		}

		validateExposedAPI()
	}

	function validateBlueprint() {
		if (!VDCBlueprint['INTERNAL_STRUCTURE']['Overview'] || !VDCBlueprint['INTERNAL_STRUCTURE']['Data_Sources'] || !VDCBlueprint['INTERNAL_STRUCTURE']['Data_Sources'].length) {
			return false
		}
		if (!VDCBlueprint['DATA_MANAGEMENT']) {
			return false
		}
		if (!VDCBlueprint['COOKBOOK_APPENDIX']['Resources']) {
			return false
		}

		return validateExposedAPI()
	}

	function validateExposedAPI() {
		if (!VDCBlueprint['EXPOSED_API'] || !VDCBlueprint['EXPOSED_API'].paths) {
			return false
		}

		var methodKeys = Object.keys(VDCBlueprint['EXPOSED_API'].paths)
		var isValidAPI = true
		for (var i = methodKeys.length - 1; i >= 0; i--) {
			var key = methodKeys[i]
			var method = {}
			method[key] = VDCBlueprint['EXPOSED_API'].paths[key]
			isValidAPI = isValidAPI && validateMethod(method)
		}
		if (isValidAPI) {
			$('#vdc-exposed-api-menu i').addClass('hide')
		} else {
			$('#vdc-exposed-api-menu i').removeClass('hide')
		}
		return isValidAPI
	}

	function removeItemFromArray(event) {
		var id = $(event.currentTarget).data('section-id')
		$('#' + id).remove()
		refreshMasonry()
	}

	function validateAPI(api, callback) {

		var options = {
			'parse': {
				'json': true
			},
			'resolve': {
				'external': true,
			},
			'dereference': {
				'circular': true,
			},
			'validate': {
				'schema': true,
				'spec': true,
			}
		}

		window.swaggerParser.validate(api, options, callback)
	}

	function handleAPI(api) {
		VDCBlueprint['EXPOSED_API'] = api
		$('#vdc-exposed-api-method select').prop('disabled', false)
		$('#vdc-exposed-api-method select').empty()

		var o = new Option('Select Method', '')
		$(o).html('Select Method')
		$('#vdc-exposed-api-method select').append(o)

		var paths = Object.keys(api.paths)
		for(var i = 0; i < paths.length; i++) {
			o = new Option(paths[i], paths[i])
			$(o).html(paths[i])

			$('#vdc-exposed-api-method select').append(o)
		}

		$('#vdc-exposed-api-method select').select2({
			templateResult: formatSelectMethods,
			templateSelection: formatSelectMethods
		})
	}

	function formatSelectMethods(state) {

		if (!state.id) {
			return state.text
		}

		var key = state.text
		if (Object.keys(VDCBlueprint['EXPOSED_API'].paths).includes(key)) {
			var method = {}
			method[key] = VDCBlueprint['EXPOSED_API'].paths[key]

			var isValid = validateMethod(method)
			var $state = $(
				'<span class="' + (isValid ? '' : 'text-danger2') + '">' + key + '</span>'
			)
			return $state
		} else {
			return state.text
		}
	}

	function validateMethod(method) {

		if (Object.keys(method) == 0) {
			return false
		}
		var methodName = Object.keys(method)[0]

		if (method[methodName]['get']) {
			var data = method[methodName]['get']

			if (data.parameters == null || !Array.isArray(data.parameters)) {
				return false
			}

			if (data.summary == null || !data.summary.trim().length) {
				return false
			}

			if (data.operationId == null || !data.operationId.trim().length) {
				return false
			}

			if (!data.responses) {
				return false
			}

			var responses = Object.keys(data.responses)
			for (var i = 0; i < responses.length; i++) {
				if (responses[i] == '200' || responses[i] == '201') {
					if (!validateContent(data.responses[responses[i]]['content'])) {
						return false
					}
				}
			}

			if (!Array.isArray(data['x-data-sources']) || !data['x-data-sources'].length) {
				return false
			}

			return true
		} else {
			return true
		}
	}

	function validateContent(content) {
		if (!content) {
			return false
		}
		if (content['application/json']) {
			if (typeof content['application/json']['schema'] != 'object') {
				return false
			}
		}
		return true
	}

	function setupSelectWithData(elementId) {
		var element = $('#' + elementId)
		var select = element.find('.select-main')
		var containerDiv = element.find('#' + element.data('vdc-container-id'))

		if (!element.data('options-data')) { return }
		var dataStr = element.data('options-data').split('\'').join('"')
		var data = JSON.parse(dataStr)

		if (!data) {return}

		var addedData = []
		var children = containerDiv.children()
		for (var i = 0; i < children.length; i++) {
			addedData.push($(children[i]).data('item-id'))
		}

		var newData = data.filter(i => addedData.indexOf(i.id) == -1 )

		select.prop('disabled', false)
		select.empty()

		for(var i = 0; i < newData.length; i++) {
			var o = new Option(data[i]['id'], JSON.stringify(newData[i]))
			$(o).html(newData[i]['type'])

			select.append(o)
		}

		select.select2()

	}
	setupSelectWithData('vdc-data-managment-attributes-data-utility')
	setupSelectWithData('vdc-data-managment-attributes-security')
	setupSelectWithData('vdc-data-managment-attributes-privacy')

	$('.btn-select.btn-insert').click(function(event) {
		var button = $(event.currentTarget)
		var sectionId  = button.data('section-id')
		var sectionDiv = $('#' + sectionId)

		var containerId  = sectionDiv.data('vdc-container-id')
		var containerDiv = $('#' + containerId)

		var select = sectionDiv.find('.select-main')
		var item = JSON.parse(select.val())
		if (!item) {return}
		var $itemDiv =$(
			'<div class="row form-item-container m-t-10 m-b-10" data-type="json-from-template" data-vdc-container-class="properties-container" data-item-id="' + item.id + '" data-item-json="' + JSON.stringify(item).split("\"").join("'") + '">' +
				'<label class="col-md-11">' + item.description + '</label>' +
				'<button type="button" class="col-md-1 btn btn-danger btn-remove" data-section-id="' + sectionId + '" data-item-id="' + item.id + '"><i class="mdi mdi-close"></i></button>' +
				'<div class="col-md-11">' +
					'<div class="row properties-container"></div>' +
				'</div>' +
			'</div>'
		)
		containerDiv.append($itemDiv)
		$itemDiv.find('.btn-remove').click(function (event) {
			var button = $(event.currentTarget)
			var sectionId  = button.data('section-id')

			button.parent().remove()
			setupSelectWithData(sectionId)
		})

		for (var i = 0; i < item.properties.length; i++) {
			if (item.properties[i].input == 'enum' || item.properties[i].input == 'bool') {
				var $propertyDiv = $(
					'<div class="col-md-12 row m-b-20" data-item-json="' + JSON.stringify(item.properties[i]).split("\"").join("'") + '">' +
						'<label class="col-md-3">' + item.properties[i].id + '</label>' +
						'<div class="col-md-9">' +
							'<select class="select2 form-control custom-select" style="width: 100%; height:36px;"></select>' +
						'</div>' +
					'</div>'
				)
				$itemDiv.find('.properties-container').append($propertyDiv)

				var innerSelect = $propertyDiv.find('select')
				innerSelect.empty()

				for (var j = 0; j < item.properties[i].predefined.length; j++) {
					var o = new Option(item.properties[i].predefined[j].name, item.properties[i].predefined[j].value, item.properties[i].predefined[j].selected, item.properties[i].predefined[j].selected)
					$(o).html(item.properties[i].predefined[j].name)
					innerSelect.append(o)
				}

				if (item.properties[i].allowCustom) {
					o = new Option('Custom', '')
					$(o).html('Custom')
					innerSelect.append(o)

					$propertyDiv.find('select').parent().append($(
						'<div class="input-group m-t-10 ' + (item.properties[i].predefined.length ? "hide" : "") + '">' +
							'<input type="text" class="form-control" placeholder="' + item.properties[i].type + '">' +
							'<div class="input-group-append ' + (item.properties[i].unitSymbol ? "" : "hide") + '">' +
								'<span class="input-group-text">' + item.properties[i].unitSymbol + '</span>' +
							'</div>' +
						'</div>'
					))
				}

				innerSelect.select2()
				innerSelect.on('change', function (event) {
					var select = $(event.currentTarget)

					if (select.val() === '') {
						select.siblings('.input-group').removeClass('hide')
					} else {
						select.siblings('.input-group').addClass('hide')
					}
				})
			} else if (item.properties[i].input == 'check') {
				var $propertyDiv = $(
					'<div class="col-md-12 row m-b-20" data-item-json="' + JSON.stringify(item.properties[i]).split("\"").join("'") + '">' +
						'<label class="col-md-3">' + item.properties[i].id + '</label>' +
						'<div class="col-md-9 checkbox-container">' +
						'</div>' +
					'</div>'
				)
				$itemDiv.find('.properties-container').append($propertyDiv)

				for (var j = 0; j < item.properties[i].predefined.length; j++) {
					$propertyDiv.find('.checkbox-container').append($(
						'<div class="custom-control custom-checkbox mr-sm-2">' +
							'<input type="checkbox" class="custom-control-input" id="' + item.properties[i].predefined[j].name + '" value="' + item.properties[i].predefined[j].value + '" name="' + item.properties[i].id + '">' +
							'<label class="custom-control-label" for="' + item.properties[i].predefined[j].name + '">' + item.properties[i].predefined[j].name + '</label>' +
						'</div>'
					))
				}
			} else if (item.properties[i].input == 'text') {
				var $propertyDiv = $(
					'<div class="col-md-12 row m-b-20" data-item-json="' + JSON.stringify(item.properties[i]).split("\"").join("'") + '">' +
						'<label class="col-md-3">' + item.properties[i].id + '</label>' +
						'<div class="col-md-9">' +
							'<div class="input-group m-t-10 ' + (item.properties[i].predefined.length ? "hide" : "") + '">' +
								'<input type="text" class="form-control" placeholder="' + item.properties[i].type + '">' +
								'<div class="input-group-append ' + (item.properties[i].unitSymbol ? "" : "hide") + '">' +
									'<span class="input-group-text">' + item.properties[i].unitSymbol + '</span>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>'
				)
				$itemDiv.find('.properties-container').append($propertyDiv)
			}
		}
		refreshMasonry()
		setupSelectWithData(sectionId)
	})

	$('#vdc-flow select').on('change', function (e) {
		if ($('#vdc-flow select').val() == 'Spark') {
			$('#vdc-flow-patameters').removeClass('hide')
			$('#vdc-flow-source-code').addClass('hide')
		} else if ($('#vdc-flow select').val() == 'Node-RED') {
			$('#vdc-flow-patameters').addClass('hide')
			$('#vdc-flow-source-code').removeClass('hide')
		} else {
			$('#vdc-flow-patameters').addClass('hide')
			$('#vdc-flow-source-code').addClass('hide')
		}
		refreshMasonry()
	})

	$('#vdc-cookbook-appendix-infrastructures-item-provider-type select').on('change', function (e) {
		if ($('#vdc-cookbook-appendix-infrastructures-item-provider-type select').val() == 'cloudsigma') {
			$('.vdc-cookbook-appendix-infrastructures-item-provider-type-cloudsigma').removeClass('hide')
			$('.vdc-cookbook-appendix-infrastructures-item-provider-type-kubernetes').addClass('hide')
		} else if ($('#vdc-cookbook-appendix-infrastructures-item-provider-type select').val() == 'kubernetes') {
			$('.vdc-cookbook-appendix-infrastructures-item-provider-type-cloudsigma').addClass('hide')
			$('.vdc-cookbook-appendix-infrastructures-item-provider-type-kubernetes').removeClass('hide')
		} else {
			$('.vdc-cookbook-appendix-infrastructures-item-provider-type-cloudsigma').addClass('hide')
			$('.vdc-cookbook-appendix-infrastructures-item-provider-type-kubernetes').addClass('hide')
		}
		refreshMasonry()
	})

	$('#vdc-data-managment select.method-select').on('change', function (e) {
		var methodKey = $('#vdc-data-managment select.method-select').val()
		if (methodKey == '') {
			$('#vdc-data-managment-attributes').addClass('hide')
			$('#vdc-data-managment .btn-parent').addClass('hide')
			return
		}

		$('#vdc-data-managment-attributes').removeClass('hide')
		$('#vdc-data-managment .btn-parent').removeClass('hide')

		refreshMasonry()
	})

	$('#vdc-exposed-api-method select').on('change', function (e) {
		var methodKey = $('#vdc-exposed-api-method select').val()

		var containerDiv = $('#vdc-exposed-api-method-details')
		containerDiv.empty()

		if (methodKey == '') {
			$('#vdc-exposed-api-x-iam-roles').addClass('hide')
			$('#vdc-exposed-api .btn-save').addClass('hide')
			return
		}

		$('#vdc-exposed-api-x-iam-roles').removeClass('hide')
		$('#vdc-exposed-api .btn-save').removeClass('hide')

		if (VDCBlueprint['EXPOSED_API'].paths[methodKey]['get']) {
			var data = VDCBlueprint['EXPOSED_API'].paths[methodKey]['get']

			// if (data.operationId == null || !data.operationId.trim().length) {
				var $operationIdDiv = $(
					'<div class="exposed-api-operationId form-group m-t-20" data-key="operationId" data-type="string" data-validation="required">'+
						'<label>Operation ID</label>'+
						'<input type="text" class="form-control date-inputmask" placeholder="">'+
						'<div class="invalid-feedback">Operation ID is required</div>'+
					'</div>'
				)
				containerDiv.append($operationIdDiv)

				if (data.operationId == null || !data.operationId.trim().length) {
					$operationIdDiv.find('input').val(methodKey.slice(1,methodKey.length))
					$operationIdDiv.find('label').addClass('text-danger')
					$operationIdDiv.find('input').addClass('is-invalid')
				} else {
					$operationIdDiv.find('input').val(data.operationId.trim())
				}
			// }


			// if (data.summary == null || !data.summary.trim().length) {
				var $summaryDiv = $(
					'<div class="exposed-api-summary form-group m-t-20" data-key="summary" data-type="string" data-validation="required">'+
						'<label>Summary</label>'+
						'<input type="text" class="form-control date-inputmask" placeholder="">'+
						'<div class="invalid-feedback">Summary is required</div>'+
					'</div>'
				)
				containerDiv.append($summaryDiv)

				if (data.summary) {
					$summaryDiv.find('input').val(data.summary.trim())
				} else {
					$summaryDiv.find('label').addClass('text-danger')
					$summaryDiv.find('input').addClass('is-invalid')
				}
			// }

			// if(data.parameters == null || !Array.isArray(data.parameters) || !data.parameters.length) {
				var $parametersDiv = $(
					'<div id="vdc-exposed-api-parameters" class="form-group m-t-20 json-object-param inline-add" data-key="" data-type="array" data-save-source="pre" data-add-source="pre" data-vdc-container-id="vdc-exposed-api-parameters-container">'+
						'<label class="d-block">Parameters<br><small class="">Should be an Array</small></label>'+
						'<div id="vdc-exposed-api-parameters-container" class="form-control" data-key="parameters" data-type="pre" data-original-type="array" data-original-item-type="json" data-save-source="pre" data-add-source="pre" data-validation="shouldRequired" style="border: none;">'+
							'<pre class="hide form-control data-type-json"></pre>'+
						'</div>'+
						'<button type="button" class="btn btn-danger right hide btn-delete" data-result-id="vdc-exposed-api-parameters"><i class="mdi mdi-delete"></i></button>'+
						'<button type="button" class="btn btn-success right hide btn-edit" data-toggle="modal" data-target="#jsonObjectModal" data-editor-mode="array" data-action="validateParameters" data-title="Parameters" data-subtitle="JSON Array" data-result-id="vdc-exposed-api-parameters"><i class="mdi mdi-pencil"></i></button>'+
						'<button type="button" class="btn btn-success right btn-add" data-toggle="modal" data-target="#jsonObjectModal" data-editor-mode="array" data-action="validateParameters" data-title="Parameters" data-subtitle="JSON Array" data-result-id="vdc-exposed-api-parameters"><i class="mdi mdi-plus"></i></button>'+
					'</div>'
				)
				containerDiv.append($parametersDiv)

				if(data.parameters && Array.isArray(data.parameters)) {
					$parametersDiv.find('pre').html(JSON.stringify(data.parameters, undefined, 4))
					$parametersDiv.find('pre').removeClass('hide')
					$parametersDiv.find('.btn-delete').removeClass('hide')
					$parametersDiv.find('.btn-edit').removeClass('hide')
					$parametersDiv.find('.btn-add').addClass('hide')
				}
			// }




			if (data.responses) {
				var responses = Object.keys(data.responses)
				for (var i = 0; i < responses.length; i++) {
					if (responses[i] == '200' || responses[i] == '201') {
						// if (!data.responses[responses[i]]['content'] || (data.responses[responses[i]]['content']['application/json'] && typeof data.responses[responses[i]]['content']['application/json']['schema'] != 'object')) {
							var $contentDiv = $(
								'<div id="vdc-exposed-api-response-content-' + responses[i] + '" class="exposed-api-response-content form-group m-t-20 json-object-param inline-add" data-key="' + responses[i] + '" data-type="json" data-save-source="pre" data-add-source="pre" data-vdc-container-id="vdc-exposed-api-response-content-' + responses[i] + '-container">'+
									'<label class="d-block">Response: ' + responses[i] + ' Content<br><small class="">JSON Object</small></label>'+
									'<div id="vdc-exposed-api-response-content-' + responses[i] + '-container" class="form-control" data-key="" data-type="pre" data-original-type="json" data-original-item-type="json" data-save-source="pre" data-add-source="pre" data-validation="required,validContent" style="border: none;">'+
										'<pre class="hide form-control data-type-json"></pre>'+
									'</div>'+
									'<button type="button" class="btn btn-danger right hide btn-delete" data-result-id="vdc-exposed-api-response-content-' + responses[i] + '"><i class="mdi mdi-delete"></i></button>'+
									'<button type="button" class="btn btn-success right hide btn-edit" data-key="' + responses[i] + '" data-toggle="modal" data-target="#jsonObjectModal" data-action="validateContent" data-title="Response: ' + responses[i] + ' Content" data-subtitle="JSON Object" data-result-id="vdc-exposed-api-response-content-' + responses[i] + '"><i class="mdi mdi-pencil"></i></button>'+
									'<button type="button" class="btn btn-success right btn-add" data-key="' + responses[i] + '" data-toggle="modal" data-target="#jsonObjectModal" data-action="validateContent" data-title="Response: ' + responses[i] + ' Content" data-subtitle="JSON Object" data-result-id="vdc-exposed-api-response-content-' + responses[i] + '"><i class="mdi mdi-plus"></i></button>'+
									'<div class="invalid-feedback">'+
										'Content is required and must be valid.<br>If there is "application/json", it must have a "schema" object'+
									'</div>'+
								'</div>'
							)
							containerDiv.append($contentDiv)

							if (data.responses[responses[i]]['content']) {
								$contentDiv.find('pre').html(JSON.stringify(data.responses[responses[i]]['content'], undefined, 4))

								$contentDiv.find('pre').removeClass('hide')
								$contentDiv.find('.btn-edit').removeClass('hide')
								$contentDiv.find('.btn-delete').removeClass('hide')
								$contentDiv.find('.btn-add').addClass('hide')
							}
						// }
							if (!data.responses[responses[i]]['content'] || (data.responses[responses[i]]['content']['application/json'] && typeof data.responses[responses[i]]['content']['application/json']['schema'] != 'object')) {
								$contentDiv.find('label').addClass('is-invalid')
								$contentDiv.find('.invalid-feedback').addClass('is-invalid')
							}
					}
				}
			}

			// if (!Array.isArray(data['x-data-sources']) || !data['x-data-sources'].length) {
				var $xDataSourceDiv = $(
					'<div id="vdc-exposed-api-x-data" class="form-group m-t-20 vdc-array" data-key="x-data-sources" data-type="array" data-validation="required,min-1,uniqueItems" data-save-source="input" data-add-source="form" data-vdc-container-id="vdc-exposed-api-x-data-container" data-reverse-if-child="false" data-original-item-type="string">'+
						'<label>x-data-sources<br><small>An array that contains all the identifiers of the data sources (as indicated in the INTERNAL_STRUCTURE.Data_Sources field) that are accessed by the method</small></label>'+
						'<div class="input-group" data-key="" data-type="string" data-validation="">'+
							'<select class="select2 form-control custom-select datasource-select" aria-describedby="vdc-exposed-api-x-data-add-btn" style="width:97%; height:36px;">' +
								'<option value="">Please Declare Data Sources first</option>' +
							'</select>' +
							'<div class="input-group-append" style="width:3%;">'+
								'<button id="vdc-exposed-api-x-data-add-btn" type="button" class="btn btn-outline btn-outline-success btn-add" data-section-id="vdc-exposed-api-x-data" data-vdc-container-id="vdc-exposed-api-x-data-container" style="width:100%;"><i class="mdi mdi-plus"></i></button>'+
							'</div>'+
							'<div class="invalid-feedback">'+
								'Add at least one x-data-source'+
							'</div>'+
						'</div>'+

						'<div id="vdc-exposed-api-x-data-container" data-reverse-if-child="false" class="vdc-array-container" data-type="input" data-key="x-data-sources" data-original-type="string" data-original-item-type="string" data-validation="min-1"></div>'+
					'</div>'
				)
				containerDiv.append($xDataSourceDiv)
				$xDataSourceDiv.find('select').select2()
				configureDataSourcesSelect(VDCBlueprint)

				if (Array.isArray(data['x-data-sources']) && data['x-data-sources'].length) {
					for (var i = 0; i < data['x-data-sources'].length; i++) {
						var vdcContainer = $xDataSourceDiv.find('.vdc-array-container')
						var vdcContainerCount = vdcContainer.children().length
						var inputGroup = $('<div class="input-group m-t-10"></div>')
						inputGroup.attr('id', 'vdc-exposed-api-x-data-vdc-array-item-' + (vdcContainerCount + 1))

						var input = $('<input type="text" class="form-control" placeholder=""disabled>')
						input.attr('aria-describedby', '#vdc-exposed-api-x-data-vdc-array-item-minus-btn-' + (vdcContainerCount + 1))
						input.val(data['x-data-sources'][i])

						var invalidDiv = $('<div class="invalid-feedback">Item must be unique</div>')

						var inputAppend = $('<div class="input-group-append"></div>')
						var inputButton = $('<button type="button" class="btn btn-outline btn-outline-danger"><i class="mdi mdi-minus"></i></button>')
						inputButton.attr('id', '#vdc-exposed-api-x-data-vdc-array-item-minus-btn-' + (vdcContainerCount + 1))
						inputButton.click(removeItemFromArray)
						inputAppend.append(inputButton)

						inputGroup.append(input)
						inputGroup.append(inputAppend)
						inputGroup.append(invalidDiv)

						vdcContainer.append(inputGroup)
					}
				} else {
					$xDataSourceDiv.find('label').addClass('text-danger')
				}

			// }

			if (Array.isArray(data['x-iam-roles']) && data['x-iam-roles'].length) {
				for (var i = 0; i < data['x-iam-roles'].length; i++) {
					var vdcContainer = $('#vdc-exposed-api-x-iam-roles-container')
					var vdcContainerCount = vdcContainer.children().length
					var inputGroup = $('<div class="input-group m-t-10"></div>')
					inputGroup.attr('id', 'vdc-exposed-api-x-iam-roles-vdc-array-item-' + (vdcContainerCount + 1))

					var input = $('<input type="text" class="form-control" placeholder=""disabled>')
					input.attr('aria-describedby', '#vdc-exposed-api-x-iam-roles-vdc-array-item-minus-btn-' + (vdcContainerCount + 1))
					input.val(data['x-iam-roles'][i])

					var invalidDiv = $('<div class="invalid-feedback">Item must be unique</div>')

					var inputAppend = $('<div class="input-group-append"></div>')
					var inputButton = $('<button type="button" class="btn btn-outline btn-outline-danger"><i class="mdi mdi-minus"></i></button>')
					inputButton.attr('id', '#vdc-exposed-api-x-iam-roles-vdc-array-item-minus-btn-' + (vdcContainerCount + 1))
					inputButton.click(removeItemFromArray)
					inputAppend.append(inputButton)

					inputGroup.append(input)
					inputGroup.append(inputAppend)
					inputGroup.append(invalidDiv)

					vdcContainer.append(inputGroup)
				}
			}

			$('.vdc-array .btn-add, .vdc-object .btn-add').unbind('click')
			$('.vdc-array .btn-add, .vdc-object .btn-add').click(addButtonListener)
			$('.json-object-param .btn-delete').click(deleteJSONListener)
			$('.json-object-param .btn-delete').unbind('click')



		}


		refreshMasonry()
	})

	//Handle Return Key pressed in order to add tags on Enter
	$(document).ready(function() {
		$(window).keydown(function(event){
			if(event.keyCode == 13) {

				if ($(event.target).hasClass('ace_text-input') || $(event.target).prop('tagName').toLowerCase() == 'textarea') {
					return true
				}

				event.preventDefault()

				var input = $(event.target)
				if (input.hasClass('enter-add-to-array')) {
					var button = $('#' + input.data('enter-id'))
					button.click()
				}

				return false
			}
		})
	})

	function refreshMasonry() {
		$('.masonry-row').masonry({
			itemSelector : '.masonry-item'
		})
	}

	$('.btn-reveal').click(function(event) {
		var button = $(event.currentTarget)
		var sectionId  = button.data('section-id')

		$(button).addClass('hide')
		if (button.data('toggle-siblings')) {
			$(button).siblings().removeClass('hide')
		}
		$('#' + sectionId).removeClass('hide')
		refreshMasonry()
	})

	$('.btn-hide').click(function(event) {
		var button = $(event.currentTarget)
		var sectionId  = button.data('section-id')

		$(button).addClass('hide')
		if (button.data('toggle-siblings')) {
			$(button).siblings().removeClass('hide')
		}
		$('#' + sectionId).addClass('hide')
		refreshMasonry()
	})

	$('#sidebarnav .sidebar-item').click(function (event) {
		var button = $(event.currentTarget)
		var sectionId  = button.data('section-id')
		if (!$(button).hasClass('selected') && !$(button).hasClass('disabled')) {
			$('#sidebarnav .sidebar-item').removeClass('selected')
			$('#sidebarnav .sidebar-item a').removeClass('active')

			$(button).addClass('selected')
			$(button).find('a').addClass('active')

			$('#vdc-editor').children().addClass('hide')
			$('#vdc-editor').find('#' + sectionId).removeClass('hide')

			if (sectionId == 'vdc-internal-structure-div') {
				$('.page-breadcrumb #vdc-section-title').html('Internal Structure')
				$('.page-breadcrumb #vdc-section-subtitle').html('General information about the VDC Blueprint')
			} else if (sectionId == 'vdc-data-managment-div') {
				$('.page-breadcrumb #vdc-section-title').html('Data Management')
				$('.page-breadcrumb #vdc-section-subtitle').html('List of methods')
			} else if (sectionId == 'vdc-cookbook-appendix-div') {
				$('.page-breadcrumb #vdc-section-title').html('Cookbook Appendix')
				$('.page-breadcrumb #vdc-section-subtitle').html('This is the definition of the Cookbook Appendix section in the blueprint')
			} else if (sectionId == 'vdc-exposed-api-div') {
				$('.page-breadcrumb #vdc-section-title').html('Exposed API')
				$('.page-breadcrumb #vdc-section-subtitle').html('The CAF RESTful API of the VDC, written according to the current version (3.0.2) of the OpenAPI Specification (OAS), but also adapted to DITAS requirements')
			} else {
				$('.page-breadcrumb #vdc-section-title').html('')
				$('.page-breadcrumb #vdc-section-subtitle').html('')
			}

			refreshMasonry()
		}
	})

	$('#vdc-export-blueprint-menu').click(function (event) {
		if (validateBlueprint()) {
			saveText(JSON.stringify(VDCBlueprint, false, 4), 'blueprint.json')
		} else {
			var alertText = 'The following sections are not ready:\n\n'
			if (!VDCBlueprint['INTERNAL_STRUCTURE']['Overview']) {
				alertText += '    ―  "Internal Structure" -> "Overview" is missing\n'
			}
			if (!VDCBlueprint['INTERNAL_STRUCTURE']['Data_Sources'] || !VDCBlueprint['INTERNAL_STRUCTURE']['Data_Sources'].length) {
				alertText += '    ―  "Internal Structure" -> "Data Sources" is missing\n'
			}
			if (!VDCBlueprint['DATA_MANAGEMENT']) {
				alertText += '    ―  "Data Management" Section is not defined\n'
			}
			if (!VDCBlueprint['COOKBOOK_APPENDIX']['Resources']) {
				alertText += '    ―  "Cookbook Appendix" -> "Resources" is missing\n'
			}
			if (!validateExposedAPI()) {
				alertText += '    ―  "Exposed API" -> not all methods are valid\n'
			}

			alertText += '\nPlease fix these problems before exporting the Blueprint'

			alert(alertText)
		}

	})

	function saveText(text, filename){
		var a = document.createElement('a')
		a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text))
		a.setAttribute('download', filename)
		a.click()
	}

	//Handle Modal
	$('#jsonObjectModal').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget)
		var title = button.data('title')
		var subtitle = button.data('subtitle')
		var resultId = button.data('result-id')
		var action = button.data('action')
		var mode = button.data('editor-mode')
		var forbiddenKeys = button.data('forbidden-keys')
		var modal = $(this)

		if (mode == 'any') {
			editor.session.setMode('ace/mode/text')
		} else {
			editor.session.setMode('ace/mode/json')
		}

		modal.find('.btn-save').data('result-id', resultId)
		modal.find('.btn-save').data('forbidden-keys', forbiddenKeys)
		modal.find('.btn-save').data('action', action || '')
		if (mode) modal.find('.btn-save').data('editor-mode', mode)
		modal.find('.modal-title').text(title)
		modal.find('.modal-subtitle').text(subtitle)

		var data = $('#' + resultId + ' pre').html() || ''
		data = data.replace('<xmp>','').replace('</xmp>','')
		try { data = JSON.parse(data); data = JSON.stringify(data, undefined, 4) } catch (e) {}
		editor.setValue(data)
		editor.selection.moveTo(0, 0)
		editor.focus()

	})

	$('#jsonObjectModal .btn-save').click(function (event) {

		var button = $(event.currentTarget)
		var resultId = button.data('result-id')
		var action = button.data('action')
		var forbiddenKeys = button.data('forbidden-keys')
		var mode = button.data('editor-mode')

		var hasResult = false
		var input = String(editor.getValue())

		try {
			var json = JSON.parse(input)
			if (json) {

				if (mode == 'any') {
					hasResult = true
				} else if (mode == 'array' && typeof json == 'object' && Array.isArray(json)) {
					hasResult = true
				} else if (!mode && typeof json == 'object' && !Array.isArray(json)) {
					hasResult = true
				}

				if (action == 'validateAPI') {
					hasResult = false
					validateAPI(json, function(err, api){
						if (err) {
							alert(err.message)
						} else {
							$('#' + resultId + ' .btn-add').html('Change API')
							$('#jsonObjectModal').modal('hide')
							handleAPI(api)
							configureMethodIds()
							if (!validateExposedAPI()) {
								alert('The API is a valid according to OpenAPI spec, but not valid according to DITAS specification')
							}
							$('#vdc-exposed-api-method select').val('')
							$('#vdc-exposed-api-method select').trigger('change')
						}
					})
				} else if (action == 'validateContent') {
					hasResult = false
					if (!validateContent(json)) {
						alert('"application/json" must include a "schema" object')
					} else {
						var methodKey = $('#vdc-exposed-api-method select').val()
						var responseCode = button.data('key')

						var tempApi = Object.assign({}, VDCBlueprint['EXPOSED_API'])

						VDCBlueprint['EXPOSED_API'].paths[methodKey][Object.keys(VDCBlueprint['EXPOSED_API'].paths[methodKey])[0]]['responses']['200']['content'] = json

						validateAPI(tempApi, function(err, api){
							if (err) {
								alert(err.message)
							} else {
								$('#' + resultId + ' pre').removeClass('hide')

								$('#' + resultId + ' .btn-edit').removeClass('hide')
								$('#' + resultId + ' .btn-delete').removeClass('hide')
								$('#' + resultId + ' .btn-add').addClass('hide')
								$('#jsonObjectModal').modal('hide')
								refreshMasonry()
							}
						})
					}
				} else if (action == 'validateParameters') {
					hasResult = false
					if (typeof json == 'object' && !Array.isArray(json)) {
						alert('Parameters must be a JSON Array')
					} else {
						var methodKey = $('#vdc-exposed-api-method select').val()

						var tempApi = Object.assign({}, VDCBlueprint['EXPOSED_API'])

						VDCBlueprint['EXPOSED_API'].paths[methodKey][Object.keys(VDCBlueprint['EXPOSED_API'].paths[methodKey])[0]]['parameters'] = json

						validateAPI(tempApi, function(err, api){
							if (err) {
								alert(err.message)
							} else {
								$('#' + resultId + ' pre').removeClass('hide')

								$('#' + resultId + ' .btn-edit').removeClass('hide')
								$('#' + resultId + ' .btn-delete').removeClass('hide')
								$('#' + resultId + ' .btn-add').addClass('hide')
								$('#jsonObjectModal').modal('hide')
								refreshMasonry()
							}
						})
					}
				}

				if (forbiddenKeys) {
					var keys = forbiddenKeys.split(',')
					for (k in keys) {
						if (json.hasOwnProperty(keys[k])) {
							hasResult = false
							alert('JSON Object cannot have the following keys:\n\n' + forbiddenKeys)
						}
					}
				}
			}
		} catch (e) {
			if (mode == 'any') {
				$('#' + resultId + ' pre').html('<xmp>' + input + '</xmp>')
				hasResult = true
			}
		}

		if (hasResult){
			if (mode == 'any') {
				$('#' + resultId + ' pre').html(JSON.stringify(json, undefined, 4))
			} else if (mode == 'array' && typeof json == 'object' && Array.isArray(json)) {
				$('#' + resultId + ' pre').html(JSON.stringify(json, undefined, 4))
			} else if (!mode && typeof json == 'object' && !Array.isArray(json)) {
				$('#' + resultId + ' pre').html(JSON.stringify(json, undefined, 4))
			}

			$('#' + resultId + ' pre').removeClass('hide')

			$('#' + resultId + ' .btn-edit').removeClass('hide')
			$('#' + resultId + ' .btn-delete').removeClass('hide')
			$('#' + resultId + ' .btn-add').addClass('hide')
			$('#jsonObjectModal').modal('hide')

			refreshMasonry()
		}

	})

	$('.json-object-param .btn-delete').unbind('click')
	$('.json-object-param .btn-delete').click(deleteJSONListener)

	function deleteJSONListener(event) {
		var button = $(event.currentTarget)
		var resultId = button.data('result-id')

		if (resultId) {
			$('#' + resultId + ' pre').html('')

			$('#' + resultId + ' pre').addClass('hide')
			$('#' + resultId + ' .btn-edit').addClass('hide')
			$('#' + resultId + ' .btn-delete').addClass('hide')
			$('#' + resultId + ' .btn-add').removeClass('hide')

			editor.setValue('')

		}

	}


	$('select.datasource-select').prop('disabled', true)
	$('select.method-select').prop('disabled', true)

	// var tempApi = {'openapi':'3.0.0','info':{'title':'Computation blueprints for SPART MANUFACTURING plant (IDEKO use case)','description':'Computations blueprints able to get data from the 3 ESTARTA 315 FV machines working on the SPART MANUFATURING plant. Expose 3 methods.','version':'0.0.1'},'paths':{'/GetStreamingData':{'get':{'summary':'Returns the streaming data for the parameters given. MachinesIds can be a comma-separated list of machines.','operationId':'GetStreamingData','parameters':[{'in':'query','name':'machines','required':true,'schema':{'type':'string'}}],'responses':{'200':{'description':'OK','content':{'application/json':{'schema':{'$ref':'#/components/schemas/GetStreamingDataResponse'}},'application/octet-stream':{'schema':{'type':'string','format':'binary'}}}},'default':{'description':'Unexpected error','content':{'application/json':{'schema':{'$ref':'#/components/schemas/ErrorResponse'}}}}},'x-data-sources':['Streaming API']}},'/GetSimplifiedDiagnostic':{'get':{'summary':'Returns a simplified view of the state of the machines in the plant. A list of comma separated machine ids can be passed.','operationId':'GetSimplifiedDiagnostic','parameters':[{'in':'query','name':'machines','required':true,'schema':{'type':'string'}}],'responses':{'200':{'description':'OK','content':{'application/json':{'schema':{'$ref':'#/components/schemas/GetSimplifiedDiagnostic'}}}}},'x-data-sources':['InfluxDB']}},'/GetFullDiagnostic':{'get':{'summary':'Returns a complete view of the states of the machines in the plant. A list of comma separated machine ids can be passed.','operationId':'GetFullDiagnostic','parameters':[{'in':'query','name':'machines','required':true,'schema':{'type':'string'}}],'responses':{'200':{'description':'OK','content':{'application/json':{'schema':{'$ref':'#/components/schemas/GetFullDiagnostic'}}}}},'x-data-sources':['InfluxDB']}}},'components':{'schemas':{'ErrorResponse':{'type':'object','properties':{'status':{'type':'integer'},'code':{'type':'integer'},'message':{'type':'string'},'link':{'type':'string'},'developerMessage':{'type':'string'}}},'GetStreamingDataResponse':{'type':'object','properties':{'machine':{'type':'string'},'group':{'type':'string'},'data':{'type':'array','items':{'type':'object','properties':{'additionalProperties':{'type':'integer'},'timestamp':{'type':'object'}}}}}},'GetSimplifiedDiagnostic':{'type':'object','properties':{'status':{'type':'string','enum':['OK','ALERT','WARNING']},'timestamp':{'type':'number','example':1550584972266},'cause':{'type':'object','properties':{'raw':{'type':'string'},'metric':{'type':'string'},'value':{'type':'number'},'unit':{'type':'string'}}}}},'GetFullDiagnostic':{'type':'object','properties':{'status':{'type':'string','enum':['OK','ALERT','WARNING']},'timestamp':{'type':'number','example':1550584972266},'cause':{'type':'object','properties':{'raw':{'type':'string'},'metric':{'type':'string'},'value':{'type':'number'},'unit':{'type':'string'}}},'signals':{'type':'object','properties':{'additionalProperties':{'type':'array','items':{'type':'array','items':{'type':'number'}}}}}}}}}}
	// handleAPI(tempApi)
	// configureMethodIds()
	// validateExposedAPI()
	refreshMasonry()
})
