import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './styles/style.scss';

import "@fancyapps/ui"
import "@fancyapps/ui/dist/fancybox.css";

import 'font-awesome/scss/font-awesome.scss'
import 'font-awesome/fonts/fontawesome-webfont.eot'
import 'font-awesome/fonts/fontawesome-webfont.svg'
import 'font-awesome/fonts/fontawesome-webfont.ttf'
import 'font-awesome/fonts/fontawesome-webfont.woff'
import 'font-awesome/fonts/fontawesome-webfont.woff2'

import burger from './components/burger'
import gifts from './components/gifts'
import catalog from './components/catalog/index'
import test from './components/test/index'
import nav from './components/nav'
import modalOrder from './components/modalOrder'
import form from './components/form'

burger()
gifts()
catalog()
test()
nav()
modalOrder()
form()