/*
 * Copyright © 2016-2017 The Thingsboard Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import $ from 'jquery';

/* eslint-disable import/no-unresolved, import/default */

import logoSvg from '../../svg/logo_title_white.svg';

/* eslint-enable import/no-unresolved, import/default */

/* eslint-disable angular/angularelement */

/*@ngInject*/
export default function HomeController(loginService, userService, deviceService, Fullscreen, $scope, $element, $rootScope, $document, $state,
                                       $log, $mdMedia, $animate, $timeout, $translate) {

    var dashboardUser = userService.getCurrentUser();

    var siteSideNav = $('.tb-site-sidenav', $element);

    var vm = this;

    vm.Fullscreen = Fullscreen;
    vm.logoSvg = logoSvg;

    if (angular.isUndefined($rootScope.searchConfig)) {
        $rootScope.searchConfig = {
            searchEnabled: false,
            showSearch: false,
            searchText: ""
        };
    }

    vm.isShowSidenav = false;
    vm.isLockSidenav = false;

    vm.authorityName = authorityName;
    vm.displaySearchMode = displaySearchMode;
    vm.logout = logout;
    vm.openProfile = openProfile;
    vm.openSidenav = openSidenav;
    vm.searchTextUpdated = searchTextUpdated;
    vm.sidenavClicked = sidenavClicked;
    vm.toggleFullscreen = toggleFullscreen;
    vm.userDisplayName = userDisplayName;

    $scope.$on('$stateChangeSuccess', function (evt, to, toParams, from) {
        if (angular.isDefined(to.data.searchEnabled)) {
            $scope.searchConfig.searchEnabled = to.data.searchEnabled;
            if ($scope.searchConfig.searchEnabled === false || to.name !== from.name) {
                $scope.searchConfig.showSearch = false;
                $scope.searchConfig.searchText = "";
            }
        } else {
            $scope.searchConfig.searchEnabled = false;
            $scope.searchConfig.showSearch = false;
            $scope.searchConfig.searchText = "";
        }
    });

    if ($mdMedia('gt-sm')) {
        vm.isLockSidenav = true;
        $animate.enabled(siteSideNav, false);
    }

    $scope.$watch(function() { return $mdMedia('gt-sm'); }, function(isGtSm) {
        vm.isLockSidenav = isGtSm;
        vm.isShowSidenav = isGtSm;
        if (!isGtSm) {
            $timeout(function() {
                $animate.enabled(siteSideNav, true);
            }, 0, false);
        } else {
            $animate.enabled(siteSideNav, false);
        }
    });

    function displaySearchMode() {
        return $scope.searchConfig.searchEnabled &&
            $scope.searchConfig.showSearch;
    }

    function toggleFullscreen() {
        if (Fullscreen.isEnabled()) {
            Fullscreen.cancel();
        } else {
            Fullscreen.all();
        }
    }

    function searchTextUpdated() {
        $scope.$broadcast('searchTextUpdated');
    }

    function authorityName() {
        var name = "user.anonymous";
        if (dashboardUser) {
            var authority = dashboardUser.authority;
            if (authority === 'SYS_ADMIN') {
                name = 'user.sys-admin';
            } else if (authority === 'TENANT_ADMIN') {
                name = 'user.tenant-admin';
            } else if (authority === 'CUSTOMER_USER') {
                name = 'user.customer';
            }
        }
        return $translate.instant(name);
    }

    function userDisplayName() {
        var name = "";
        if (dashboardUser) {
            if ((dashboardUser.firstName && dashboardUser.firstName.length > 0) ||
                (dashboardUser.lastName && dashboardUser.lastName.length > 0)) {
                if (dashboardUser.firstName) {
                    name += dashboardUser.firstName;
                }
                if (dashboardUser.lastName) {
                    if (name.length > 0) {
                        name += " ";
                    }
                    name += dashboardUser.lastName;
                }
            } else {
                name = dashboardUser.email;
            }
        }
        return name;
    }

    function openProfile() {
        $state.go('home.profile');
    }

    function logout() {
        userService.logout();
    }

    function openSidenav() {
        vm.isShowSidenav = true;
    }

    function closeSidenav() {
        vm.isShowSidenav = false;
    }

    function sidenavClicked() {
        if (!vm.isLockSidenav) {
            closeSidenav();
        }
    }

}

/* eslint-enable angular/angularelement */