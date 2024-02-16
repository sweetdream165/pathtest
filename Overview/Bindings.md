|-LIL OVERVIEW FOR BINDING MODULE AND RELATED THINGS-|

1.PROPERTY
2.HTML ELEMENTS
3.BINDING PROPERTY

///PROPERTY///
*For binding, we have to use a thing I called "Property" ("Prop" for short), but you can treat it like a regular variable.(global Var or scoped Let(IN_PROGRESS)). "Property" keeps the window object clean. FURTHER IN THE DOCUMENTATION: JSProperty.

EXAMPLE: "prop.nameProp = 'something'"
{NOTE: Typically you create variables like "let some = 'hello'" and i would like to create "Property" like that, but unfortunately u cant create custom types, so the closest result u can get is the example above."}

///HTML ELEMENTS///
*Since JS doesn't allow you to override the assignment of HTML element properties(Probably for security reasons), I implement an additional layer via "Proxy"(LINK). Luckily, "Query selectors" have been rewritten to avoid further errors and bugs. There is only one difference: u no longer need to assign the queryed element to a variable, the binding module will do this automatically, but u can if u want. Acces name will be the class or id(depends on query). Query elements as usual "document.querySelector()" or use shortcut(IN_PROGRESS) "$query()".
Once u query element it will be available everywhere, because if you did, you'll probably want to work with it, so we just avoid unnecessary duplicating and double querying. Don`t worry, if u accidentally query twice, Binding module will handle it and return an existing one. FURTHER IN THE DOCUMENTATION: ELEMENT.

EXAMPLE: document.querySelector('.SomeElement') or $query('.SomeElement')
         document.querySelectorAll('.SomeElements') or $queryAll('.SomeElement')

///BINDING PROPERTY///
*ATTENTION! It's time to talk about how to actually bind, aaaaaaaaand it`s just like that... "Element.property = $myProperty". Simply assign your newly created JSProperty to the ELEMENT-Property, but be careful while assigning JSProperty, you need to put "$" symbol in front otherwise if you want to change the JSProperty value don't use "$". To be more clear see the example below, with creating JSProperty and selecting ELEMENT.

EXAMPLE: document.querySelector('.someInput');
         prop.myInputValue = 'Hello from prop :)~'
         //Binding property
         someInput.value = $myInputValue
         //Changing property value
         myInputValue = 'Value has changed, you should see it in the input.'

[ABAILABLE FEATURES]
- U can bind JSProperty(global, scoped(IN_PROGRESS)) to any ELEMENT-property. When changed, this JSProperty will automatically update attached ELEMENT-property.
- Bindings are 2-way, which means that when an ELEMENT-property is updated, the JSProperty will also be updated.
- U can bind multiple ELEMENTs with different or same ELEMENT-propertys to one JSProperty.
- U can bind multiple JSPropertys to different ELEMENT-propertys of one ELEMENT.

[IN PROGRESS]
- Local scoped propertys
- QuerySelectors shortcut
- Binding inside HTML
- Scripts inside HTML